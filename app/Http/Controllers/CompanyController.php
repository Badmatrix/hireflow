<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Models\Job;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Company::class);

        $allowedSorts = [
            'name',
            'location',
            'is_verified',
            'created_at',
            'jobs_count',
        ];

        $sort = $request->string('sort')->toString();
        $direction = $request->string('direction')->toString();

        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }

        if (!in_array($direction, ['asc', 'desc'], true)) {
            $direction = 'desc';
        }

        $status = $request->string('status')->toString();

        if (!in_array($status, ['verified', 'pending'], true)) {
            $status = '';
        }

        $query = Company::query()
            ->withCount('jobs');

        $query->when(
            $request->filled('search'),
            function ($query) use ($request) {
                $search = $request
                    ->string('search')
                    ->toString();

                $query->where(
                    'name',
                    'like',
                    "%{$search}%"
                );
            }
        );

        $query->when(
            $status !== '',
            function ($query) use ($status) {
                $query->where(
                    'is_verified',
                    $status === 'verified'
                );
            }
        );

        if ($sort === 'jobs_count') {
            $query->orderBy(
                'jobs_count',
                $direction
            );
        } else {
            $query->orderBy(
                $sort,
                $direction
            );
        }

        $companies = $query
            ->paginate(10)
            ->withQueryString();

        return inertia(
            'companies/pages/Index',
            [
                'companies' => $companies,

                'filters' => [
                    'search' => $request
                        ->string('search')
                        ->toString(),

                    'status' => $status,

                    'sort' => $sort,

                    'direction' => $direction,
                ],

                'isAdmin' => auth()->guard()->user()->isAdmin(),

                'canCreate' => auth()->guard()->user()->isEmployer(),
            ]
        );
    }

    public function create(): Response
    {
        $this->authorize('create', Company::class);

        return Inertia::render(
            'companies/pages/Create'
        );
    }

    public function store(
        StoreCompanyRequest $request
    ): RedirectResponse {
        $this->authorize('create', Company::class);

        $validated = $request->validated();

        $company = new Company($validated);

        $company->user_id = $request->user()->id;

        $company->slug = Company::generateUniqueSlug(
            $validated['name']
        );

        $company->is_verified = false;

        $company->save();

        return redirect()
            ->route('companies.index')
            ->with(
                'success',
                'Company created successfully.'
            );
    }

    public function show(
        Company $company
    ): Response {
        if (! $company->is_verified) {
            $this->authorize('view', $company);
        }

        return Inertia::render(
            'companies/pages/Show',
            [
                'company' => $company,
            ]
        );
    }

    public function edit(
        Company $company
    ): Response {
        $this->authorize('update', $company);

        return Inertia::render(
            'companies/pages/Edit',
            [
                'company' => $company,
            ]
        );
    }

    public function update(
        updateCompanyRequest $request,
        Company $company
    ): RedirectResponse {
        $this->authorize('update', $company);

        $validated = $request->validated();

        if ($validated['name'] !== $company->name) {
            $validated['slug'] =
                Company::generateUniqueSlug(
                    $validated['name']
                );
        }

        $company
            ->fill($validated)
            ->save();

        return redirect()
            ->route('companies.index')
            ->with(
                'success',
                'Company updated successfully.'
            );
    }

    public function verify(
        Company $company
    ): RedirectResponse {
        $this->authorize('verify', $company);

        $company->is_verified = true;
        $company->save();

        return redirect()
            ->route('companies.index')
            ->with(
                'success',
                'Company verified successfully.'
            );
    }

    public function destroy(
        Company $company
    ): RedirectResponse {
        $this->authorize('delete', $company);

        $company->delete();

        return redirect()
            ->route('companies.index')
            ->with(
                'success',
                'Company deleted successfully.'
            );
    }

    //job seeker browse company

    public function browse(Request $request)
    {
        $search = $request->string('search')->toString();

        $companies = Company::query()
            ->where('is_verified', true)
            ->withCount([
                'jobs as published_jobs_count' => function ($query) {
                    $query
                        ->where('status', Job::STATUS_PUBLISHED)
                        ->where(function ($query) {
                            $query
                                ->whereNull('closing_date')
                                ->orWhereDate('closing_date', '>=', today());
                        });
                },
            ])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return inertia('companies/pages/Browse', [
            'companies' => $companies,

            'filters' => [
                'search' => $search,
            ],
        ]);
    }
    public function publicShow(Company $company)
    {
        abort_unless($company->is_verified, 404);

        $company->load([
            'jobs' => function ($query) {
                $query
                    ->where('status', Job::STATUS_PUBLISHED)
                    ->where(function ($query) {
                        $query
                            ->whereNull('closing_date')
                            ->orWhereDate('closing_date', '>=', today());
                    })
                    ->latest();
            },
        ]);

        return inertia('companies/pages/PublicShow', [
            'company' => $company,
        ]);
    }
}
