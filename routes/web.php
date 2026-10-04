<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'active'])->group(function () {


    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch(
        '/notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    )->name('notifications.read');


    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');



    Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');


    /*
    |--------------------------------------------------------------------
    | Job seeker only
    |--------------------------------------------------------------------
    */
    Route::middleware('role:job seeker')->group(function () {
        Route::get('/companies/browse', [CompanyController::class, 'browse'])->name('companies.browse');
        Route::get('/companies/browse/{company:slug}', [CompanyController::class, 'publicShow'])->name('companies.browse.show');

        Route::get('/jobs/browse', [JobController::class, 'browse'])->name('jobs.browse');
        Route::get('/jobs/browse/{job:slug}', [JobController::class, 'browseShow'])
        ->name('jobs.browse.show');
        Route::get('/jobs/browse/{job:slug}/apply', [ApplicationController::class, 'create'])->name('applications.create');
        Route::post('/jobs/browse/{job:slug}/apply', [ApplicationController::class, 'store'])->name('applications.store');


        Route::patch('/applications/{application}/withdraw', [ApplicationController::class, 'withdraw'])->name('applications.withdraw');

        Route::resource('/resumes', ResumeController::class)->only([
                'index', 'create', 'store', 'destroy',
            ]);
        Route::get('/resumes/{resume}/view', [ResumeController::class, 'view'])
        ->name('resumes.view');
        Route::post('/resumes/{resume}/default', [ResumeController::class, 'setDefault'])->name('resumes.default');



    });

    /*
    |--------------------------------------------------------------------
    | Employer only
    |--------------------------------------------------------------------
    */
    Route::middleware('role:employer')->group(function () {

        Route::get('/employer/applications', [ApplicationController::class, 'employerIndex'])
                ->name('applications.employer.index');


        Route::get('/jobs/{job}/applications', [ApplicationController::class, 'jobApplications'])->name('jobs.applications');

        Route::post('/jobs/{job}/publish', [JobController::class, 'publish'])->name('jobs.publish');


        Route::get('/applications/{application}', [ApplicationController::class, 'show'])->name('applications.show');

        Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applications.status.update');

        Route::get('/applications/{application}/resume', [ApplicationController::class, 'resume'])->name('applications.resume');



    });

    /*
        |--------------------------------------------------------------------
        | Admin only
        |--------------------------------------------------------------------
        */
    Route::middleware('role:admin')->group(function () {
        Route::post('/companies/{company}/verify', [CompanyController::class, 'verify'])->name('companies.verify');

        Route::get('/users', [UserController::class, 'index'])
               ->name('users.index');

        Route::patch('/users/{user}/status', [UserController::class, 'updateStatus'])
            ->name('users.status.update');

    });


    /*
    |--------------------------------------------------------------------
    | Shared — admin + employer
    |--------------------------------------------------------------------
    */
    Route::middleware('role:admin,employer')->group(function () {
        Route::resource('companies', CompanyController::class);

        Route::resource('jobs', JobController::class)->only([
                    'index', 'create', 'store', 'show', 'edit', 'update', 'destroy',
                ]);

    });



});

require __DIR__.'/settings.php';
