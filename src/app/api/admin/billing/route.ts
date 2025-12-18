import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List all invoices
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hospitalId = session.user.hospitalId;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const invoices = await prisma.invoice.findMany({
      where: {
        hospitalId,
        ...(status && status !== "all" && { status }),
        ...(search && {
          OR: [
            { invoiceNumber: { contains: search } },
            { patient: { name: { contains: search } } },
          ],
        }),
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get stats
    const stats = await prisma.invoice.groupBy({
      by: ["status"],
      where: { hospitalId },
      _sum: { total: true },
      _count: true,
    });

    const totalRevenue = await prisma.invoice.aggregate({
      where: { hospitalId, status: "paid" },
      _sum: { total: true },
    });

    const pendingAmount = await prisma.invoice.aggregate({
      where: { hospitalId, status: { in: ["pending", "partial", "overdue"] } },
      _sum: { total: true },
    });

    return NextResponse.json({
      invoices: invoices.map((inv) => ({
        ...inv,
        subtotal: Number(inv.subtotal),
        tax: Number(inv.tax),
        discount: Number(inv.discount),
        total: Number(inv.total),
        paidAmount: Number(inv.paidAmount),
        payments: inv.payments.map((p) => ({
          ...p,
          amount: Number(p.amount),
        })),
      })),
      stats: {
        totalRevenue: Number(totalRevenue._sum.total) || 0,
        pendingAmount: Number(pendingAmount._sum.total) || 0,
        byStatus: stats.reduce((acc, s) => {
          acc[s.status] = { count: s._count, total: Number(s._sum.total) || 0 };
          return acc;
        }, {} as Record<string, { count: number; total: number }>),
      },
    });
  } catch (error) {
    console.error("Billing list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hospitalId = session.user.hospitalId;
    const body = await request.json();
    const { patientId, items, tax, discount, dueDate, appointmentId, notes } = body;

    if (!patientId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Patient and items are required" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = tax || 0;
    const discountAmount = discount || 0;
    const total = subtotal + taxAmount - discountAmount;

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { hospitalId },
      orderBy: { createdAt: "desc" },
    });

    const invoiceCount = lastInvoice
      ? parseInt(lastInvoice.invoiceNumber.split("-")[1]) + 1
      : 1;
    const invoiceNumber = `INV-${invoiceCount.toString().padStart(6, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        patientId: parseInt(patientId),
        hospitalId,
        items,
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        total,
        dueDate: new Date(dueDate),
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        notes,
      },
      include: {
        patient: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      message: "Invoice created successfully",
      invoice: {
        ...invoice,
        subtotal: Number(invoice.subtotal),
        tax: Number(invoice.tax),
        discount: Number(invoice.discount),
        total: Number(invoice.total),
      },
    });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

// PATCH - Update invoice or record payment
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invoiceId, action, ...data } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (action === "payment") {
      // Record payment
      const { amount, method, reference, notes } = data;

      if (!amount || !method) {
        return NextResponse.json(
          { error: "Amount and method are required" },
          { status: 400 }
        );
      }

      const payment = await prisma.payment.create({
        data: {
          invoiceId,
          amount,
          method,
          reference,
          notes,
        },
      });

      // Update invoice paid amount
      const newPaidAmount = Number(invoice.paidAmount) + amount;
      const newStatus =
        newPaidAmount >= Number(invoice.total)
          ? "paid"
          : newPaidAmount > 0
          ? "partial"
          : invoice.status;

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          paidDate: newPaidAmount >= Number(invoice.total) ? new Date() : null,
          status: newStatus,
        },
      });

      return NextResponse.json({
        message: "Payment recorded successfully",
        payment: { ...payment, amount: Number(payment.amount) },
      });
    } else {
      // Update invoice status
      const { status } = data;
      const updated = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status },
      });

      return NextResponse.json({
        message: "Invoice updated successfully",
        invoice: updated,
      });
    }
  } catch (error) {
    console.error("Update invoice error:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
