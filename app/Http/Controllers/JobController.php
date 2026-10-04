<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Models\Company;
use App\Models\Job;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class JobController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {

        $this->authorize('viewAny', Job::class);

        $allowedSorts = [
            'title',
            'status',
            'closing_date',
            'created_at',
        ];

        $sort = $request->string('sort')->toString();

        $direction = $request->string('direction')->toString();

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }


        $query = Job::query()
          ->with('company')
          ->when(
              auth()->guard()->user()->isEmployer(),
              fn ($query) => $query->whereHas(
                  'company',
                  fn ($query) => $query->where(
                      'user_id',
                      auth()->guard()->id()
                  )
              )
          );


        $query->when(
            $request->filled('search'),
            function ($query) use ($request) {
                $search = $request
                    ->string('search')
                    ->toString();

                $query->where(function ($query) use ($search) {
                    $query
                        ->where('title', 'like', "%{$search}%")
                        ->orWhereHas('company', function ($query) use ($search) {
                            $query->where(
                                'name',
                                'like',
                                "%{$search}%"
                            );
                        });
                });
            }
        );

        $query->when(
            $request->filled('status'),
            function ($query) use ($request) {
                $query->where(
                    'status',
                    $request->string('status')->toString()
                );
            }
        );

        $query->orderBy($sort, $direction);

        $jobs = $query
            ->paginate(10)
            ->withQueryString();

        return inertia('jobs/pages/Index', [
            'jobs' => $jobs,

            'filters' => [
                'search' => $request
                    ->string('search')
                    ->toString(),

                'status' => $request
                    ->string('status')
                    ->toString(),

                'sort' => $sort,
                'direction' => $direction,
            ],

            'isAdmin' => auth()->guard()->user()->isAdmin(),
            'isEmployer' => auth()->guard()->user()->isEmployer(),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', Job::class);

        $user = $request->user();

        $companies = $user->companies()
            ->orderBy('name')
            ->get(['id', 'name']);

        return inertia('jobs/pages/Create', [
            'companies' => $companies,
        ]);
    }


    public function store(StoreJobRequest $request): RedirectResponse
    {
        $this->authorize('create', Job::class);

        $validated = $request->validated();

        $job = new Job();

        $job->company_id = $validated['company_id'];
        $job->title = $validated['title'];
        $job->slug = Job::generateUniqueSlug($validated['title']);
        $job->description = $validated['description'];
        $job->location = $validated['location'];
        $job->employment_type = $validated['employment_type'];
        $job->experience_level = $validated['experience_level'];
        $job->salary_min = $validated['salary_min'] ?? null;
        $job->salary_max = $validated['salary_max'] ?? null;
        $job->closing_date = $validated['closing_date'] ?? null;
        $job->status = Job::STATUS_DRAFT;

        $job->save();

        return redirect()
            ->route('jobs.index')
            ->with('success', 'Job created successfully.');
    }

    public function show(Job $job)
    {
        $this->authorize('view', $job);

        $job->load('company');

        return inertia('jobs/pages/Show', [
            'job' => $job,
        ]);
    }

    public function edit(Job $job): Response
    {
        $this->authorize('update', $job);

        $user = auth()->guard()->user();

        $companies = $user->companies()
            ->orderBy('name')
            ->get(['id', 'name']);

        // $job->load('company');

        return inertia('jobs/pages/Edit', [
            'job' => $job,
            'companies' => $companies,
        ]);
    }

    public function update(
        UpdateJobRequest $request,
        Job $job
    ): RedirectResponse {
        $this->authorize('update', $job);

        $validated = $request->validated();

        if ($validated['title'] !== $job->title) {
            $validated['slug'] = Job::generateUniqueSlug(
                $validated['title']
            );
        }

        $job->update($validated);

        return redirect()
            ->route('jobs.index')
            ->with('success', 'Job updated successfully.');
    }

    public function destroy(Job $job): RedirectResponse
    {
        $this->authorize('delete', $job);

        $job->delete();

        return redirect()
            ->route('jobs.index')
            ->with('success', 'Job deleted successfully.');
    }

    public function publish(Job $job): RedirectResponse
    {
        $this->authorize('publish', $job);

        $job->update([
            'status' => Job::STATUS_PUBLISHED,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Job published successfully.');
    }


    public function browse(Request $request)
    {
        $search = $request->string('search')->toString();

        $jobs = Job::query()
            ->with('company')
            ->where('status', Job::STATUS_PUBLISHED)
            ->whereHas('company', function ($query) {
                $query->where('is_verified', true);
            })
            ->where(function ($query) {
                $query
                    ->whereNull('closing_date')
                    ->orWhereDate('closing_date', '>=', today());
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhere('employment_type', 'like', "%{$search}%")
                        ->orWhere('experience_level', 'like', "%{$search}%")
                        ->orWhereHas('company', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return inertia('jobs/pages/Browse', [
            'jobs' => $jobs,

            'filters' => [
                'search' => $search,
            ],
        ]);
    }
    public function browseShow(Job $job)
    {
        $job->load('company');

        abort_unless(
            $job->status === Job::STATUS_PUBLISHED,
            404
        );

        abort_unless(
            $job->company->is_verified,
            404
        );

        abort_unless(
            $job->closing_date === null ||
            $job->closing_date->isToday() ||
            $job->closing_date->isFuture(),
            404
        );

        $hasApplied = false;

        if (auth()->guard()->check()) {
            $hasApplied = $job->applications()
                ->where('user_id', auth()->guard()->id())
                ->exists();
        }

        return inertia('jobs/pages/BrowseShow', [
            'job' => $job,
            'hasApplied' => $hasApplied,
            'isJobSeeker' => auth()->guard()->user()->isJobSeeker(),
        ]);
    }
}
