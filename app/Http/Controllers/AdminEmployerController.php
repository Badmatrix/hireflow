<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminEmployerController extends Controller
{
    public function index(): Response
    {
        $employers = User::query()
            ->with('role')
            ->whereHas('role', function ($query) {
                $query->where('name', 'employer');
            })
            ->whereIn('employer_status', ['pending', 'approved', 'rejected'])
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/pages/employers/index', [
            'employers' => $employers,
        ]);
    }

    public function approve(User $user): RedirectResponse
    {
        abort_unless($user->isEmployer(), 404);

        $user->employer_status = 'approved';
        $user->save();

        return back()->with('success', 'Employer approved successfully.');
    }

    public function reject(User $user): RedirectResponse
    {
        abort_unless($user->isEmployer(), 404);

        $user->employer_status = 'rejected';
        $user->save();

        return back()->with('success', 'Employer rejected.');
    }
}
