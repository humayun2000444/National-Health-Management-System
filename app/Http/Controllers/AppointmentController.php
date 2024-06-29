<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'date' => 'required|date',
            'department' => 'required|string|max:255',
            'number' => 'required|string|max:15',
            'message' => 'nullable|string',
        ]);

        Appointment::create([
            'name' => $request->name,
            'email' => $request->email,
            'date' => $request->date,
            'department' => $request->department,
            'number' => $request->number,
            'message' => $request->message,
        ]);

        return redirect()->back()->with('success', 'Appointment submitted successfully!');
    }
}
