<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    // Store method remains unchanged
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

    // New method to fetch user's appointments
    public function userAppointments()
    {
        $appointments = Appointment::where('email', auth()->user()->email)->get();
        return view('home', compact('appointments'));
    }
}
