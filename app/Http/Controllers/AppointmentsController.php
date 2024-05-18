<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'appointment_date' => 'required|date',
            'department' => 'required|string',
            'message' => 'nullable|string',
        ]);

        Appointment::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'appointment_date' => $request->appointment_date,
            'department' => $request->department,
            'message' => $request->message,
        ]);

        return redirect()->back()->with('success', 'Appointment request submitted successfully!');
    }
}
