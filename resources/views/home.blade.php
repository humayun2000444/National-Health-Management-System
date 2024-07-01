@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <!-- Dashboard Card -->
            <div class="card mb-4 shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">{{ __('Dashboard') }}</h4>
                </div>
                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    <p class="lead">Welcome back, {{ Auth::user()->name }}!</p>
                    <p>{{ __('You are logged in!') }}</p>
                </div>
            </div>

            <!-- Appointments Table -->
            <div class="card shadow-sm">
                <div class="card-header bg-secondary text-white">
                    <h5 class="mb-0">{{ __('Your Appointments') }}</h5>
                </div>
                <div class="card-body">
                    @if($appointments->isEmpty())
                        <div class="alert alert-info" role="alert">
                            You have no appointments.
                        </div>
                    @else
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>Department</th>
                                    <th>Number</th>
                                    <th>Message</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($appointments as $appointment)
                                    <tr>
                                        <td>{{ $appointment->id }}</td>
                                        <td>{{ $appointment->name }}</td>
                                        <td>{{ $appointment->email }}</td>
                                        <td>{{ \Carbon\Carbon::parse($appointment->date)->format('d M Y') }}</td>
                                        <td>{{ $appointment->department }}</td>
                                        <td>{{ $appointment->number }}</td>
                                        <td>{{ $appointment->message }}</td>
                                        <td>{{ \Carbon\Carbon::parse($appointment->created_at)->format('d M Y h:i A') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
