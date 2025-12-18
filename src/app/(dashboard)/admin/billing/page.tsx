"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, Pagination, Column } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import {
  Plus,
  Search,
  Download,
  Eye,
  DollarSign,
  CreditCard,
  Loader2,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Trash2,
  Printer,
} from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Payment {
  id: number;
  amount: number;
  method: string;
  reference: string | null;
  paidAt: string;
  notes: string | null;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  dueDate: string;
  paidAmount: number;
  paidDate: string | null;
  payments: Payment[];
  notes: string | null;
  createdAt: string;
}

interface Stats {
  totalRevenue: number;
  pendingAmount: number;
  byStatus: Record<string, { count: number; total: number }>;
}

interface Patient {
  id: number;
  name: string;
  email: string;
}

interface InvoiceFormData {
  patientId: string;
  items: InvoiceItem[];
  tax: number;
  discount: number;
  dueDate: string;
  notes: string;
}

interface PaymentFormData {
  amount: number;
  method: string;
  reference: string;
  notes: string;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentMethods = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "insurance", label: "Insurance" },
  { value: "cheque", label: "Cheque" },
];

const initialInvoiceForm: InvoiceFormData = {
  patientId: "",
  items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
  tax: 0,
  discount: 0,
  dueDate: "",
  notes: "",
};

const initialPaymentForm: PaymentFormData = {
  amount: 0,
  method: "cash",
  reference: "",
  notes: "",
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    pendingAmount: 0,
    byStatus: {},
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceFormData>(initialInvoiceForm);
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>(initialPaymentForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
    fetchPatients();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/billing?${params}`);
      if (!response.ok) throw new Error("Failed to fetch invoices");
      const data = await response.json();
      setInvoices(data.invoices);
      setStats(data.stats);
    } catch (err) {
      setError("Failed to load invoices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/admin/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data.map((p: Patient & { id: string | number }) => ({
        id: typeof p.id === 'string' ? parseInt(p.id) : p.id,
        name: p.name,
        email: p.email,
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchInvoices();
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceForm.items.length > 1) {
      const newItems = invoiceForm.items.filter((_, i) => i !== index);
      setInvoiceForm({ ...invoiceForm, items: newItems });
    }
  };

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceForm.items];
    if (field === "description") {
      newItems[index].description = value as string;
    } else {
      newItems[index][field] = Number(value);
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const total = subtotal + invoiceForm.tax - invoiceForm.discount;
    return { subtotal, total };
  };

  const handleCreateInvoice = async () => {
    if (!invoiceForm.patientId) {
      setFormError("Please select a patient");
      return;
    }
    if (invoiceForm.items.some((item) => !item.description || item.unitPrice <= 0)) {
      setFormError("Please fill in all item details");
      return;
    }
    if (!invoiceForm.dueDate) {
      setFormError("Please set a due date");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/admin/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: invoiceForm.patientId,
          items: invoiceForm.items.map((item) => ({
            ...item,
            total: item.quantity * item.unitPrice,
          })),
          tax: invoiceForm.tax,
          discount: invoiceForm.discount,
          dueDate: invoiceForm.dueDate,
          notes: invoiceForm.notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      setIsCreateModalOpen(false);
      setInvoiceForm(initialInvoiceForm);
      fetchInvoices();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedInvoice) return;
    if (paymentForm.amount <= 0) {
      setFormError("Amount must be greater than 0");
      return;
    }
    if (!paymentForm.method) {
      setFormError("Please select a payment method");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/admin/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          action: "payment",
          amount: paymentForm.amount,
          method: paymentForm.method,
          reference: paymentForm.reference || null,
          notes: paymentForm.notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to record payment");
      }

      setIsPaymentModalOpen(false);
      setPaymentForm(initialPaymentForm);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const openViewModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const openPaymentModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm({
      ...initialPaymentForm,
      amount: invoice.total - invoice.paidAmount,
    });
    setFormError("");
    setIsPaymentModalOpen(true);
  };

  const getStatusVariant = (status: string): "success" | "warning" | "danger" | "secondary" | "primary" => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "partial":
        return "primary";
      case "overdue":
        return "danger";
      case "cancelled":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const columns: Column<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice #",
      render: (invoice) => (
        <span className="font-medium text-slate-900">{invoice.invoiceNumber}</span>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      render: (invoice) => (
        <div>
          <p className="font-medium text-slate-900">{invoice.patient.name}</p>
          <p className="text-sm text-slate-500">{invoice.patient.email}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Amount",
      render: (invoice) => (
        <div>
          <p className="font-semibold text-slate-900">{formatCurrency(invoice.total)}</p>
          {invoice.paidAmount > 0 && invoice.paidAmount < invoice.total && (
            <p className="text-sm text-slate-500">
              Paid: {formatCurrency(invoice.paidAmount)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (invoice) => (
        <span className={new Date(invoice.dueDate) < new Date() && invoice.status !== "paid" ? "text-red-600" : ""}>
          {new Date(invoice.dueDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (invoice) => (
        <Badge variant={getStatusVariant(invoice.status)}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (invoice) => new Date(invoice.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (invoice) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openViewModal(invoice)}>
            <Eye className="h-4 w-4" />
          </Button>
          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPaymentModal(invoice)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading && invoices.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Billing & Invoices" subtitle="Loading..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Billing & Invoices"
        subtitle="Manage hospital billing and payments"
      />

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
            <Button variant="ghost" size="sm" onClick={fetchInvoices} className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending Amount</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Paid Invoices</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.byStatus?.paid?.count || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Invoices</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {invoices.length}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="w-44">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => {
                setInvoiceForm(initialInvoiceForm);
                setFormError("");
                setIsCreateModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <Table
          columns={columns}
          data={paginatedInvoices}
          keyExtractor={(invoice) => invoice.id.toString()}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredInvoices.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Invoice"
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {formError}
            </div>
          )}

          <Select
            label="Patient"
            options={[
              { value: "", label: "Select a patient" },
              ...patients.map((p) => ({ value: p.id.toString(), label: `${p.name} (${p.email})` })),
            ]}
            value={invoiceForm.patientId}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, patientId: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Invoice Items
            </label>
            <div className="space-y-3">
              {invoiceForm.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, "quantity", e.target.value)}
                      min={1}
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => updateInvoiceItem(index, "unitPrice", e.target.value)}
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <div className="w-24 pt-2 text-right font-medium">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInvoiceItem(index)}
                    disabled={invoiceForm.items.length === 1}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addInvoiceItem}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tax Amount"
              type="number"
              value={invoiceForm.tax}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, tax: Number(e.target.value) })}
              min={0}
              step={0.01}
            />
            <Input
              label="Discount"
              type="number"
              value={invoiceForm.discount}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: Number(e.target.value) })}
              min={0}
              step={0.01}
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={invoiceForm.dueDate}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={invoiceForm.notes}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>

          {/* Invoice Summary */}
          <div className="p-4 bg-slate-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateTotals().subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatCurrency(invoiceForm.tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span>-{formatCurrency(invoiceForm.discount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(calculateTotals().total)}</span>
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateInvoice} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Invoice"
            )}
          </Button>
        </ModalFooter>
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Invoice ${selectedInvoice?.invoiceNumber || ""}`}
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selectedInvoice.patient.name}</h3>
                <p className="text-slate-500">{selectedInvoice.patient.email}</p>
                {selectedInvoice.patient.phone && (
                  <p className="text-slate-500">{selectedInvoice.patient.phone}</p>
                )}
              </div>
              <Badge variant={getStatusVariant(selectedInvoice.status)} className="text-sm">
                {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Invoice Date</p>
                <p className="font-medium">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Due Date</p>
                <p className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="font-medium mb-2">Items</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3">Description</th>
                      <th className="text-right p-3">Qty</th>
                      <th className="text-right p-3">Price</th>
                      <th className="text-right p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInvoice.items as InvoiceItem[]).map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-3 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(selectedInvoice.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{formatCurrency(selectedInvoice.discount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(selectedInvoice.total)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid</span>
                <span>{formatCurrency(selectedInvoice.paidAmount)}</span>
              </div>
              {selectedInvoice.paidAmount < selectedInvoice.total && (
                <div className="flex justify-between text-amber-600 font-medium">
                  <span>Balance Due</span>
                  <span>{formatCurrency(selectedInvoice.total - selectedInvoice.paidAmount)}</span>
                </div>
              )}
            </div>

            {/* Payment History */}
            {selectedInvoice.payments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Payment History</h4>
                <div className="space-y-2">
                  {selectedInvoice.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-slate-500">{payment.method} {payment.reference && `- ${payment.reference}`}</p>
                      </div>
                      <div className="text-right text-slate-500">
                        {new Date(payment.paidAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedInvoice.notes && (
              <div>
                <h4 className="font-medium mb-1">Notes</h4>
                <p className="text-sm text-slate-600">{selectedInvoice.notes}</p>
              </div>
            )}
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {selectedInvoice && selectedInvoice.status !== "paid" && selectedInvoice.status !== "cancelled" && (
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                openPaymentModal(selectedInvoice);
              }}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
        size="md"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Invoice</p>
              <p className="font-semibold">{selectedInvoice.invoiceNumber}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span>Balance Due</span>
                <span className="font-semibold text-amber-600">
                  {formatCurrency(selectedInvoice.total - selectedInvoice.paidAmount)}
                </span>
              </div>
            </div>

            <Input
              label="Payment Amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
              min={0}
              max={selectedInvoice.total - selectedInvoice.paidAmount}
              step={0.01}
              required
            />

            <Select
              label="Payment Method"
              options={paymentMethods}
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              required
            />

            <Input
              label="Reference Number"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              placeholder="Transaction ID, Check #, etc."
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                placeholder="Payment notes..."
              />
            </div>
          </div>
        )}
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsPaymentModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleRecordPayment} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Record Payment
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
