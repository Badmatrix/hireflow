<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResumeRequest;
use App\Http\Requests\UpdateResumeRequest;
use App\Models\Resume;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class ResumeController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Resume::class);

        $resumes = auth()->guard()
            ->user()
            ->resumes()
            ->latest()
            ->get();

        return inertia('resumes/pages/Index', [
            'resumes' => $resumes,
        ]);
    }
    public function view(Resume $resume)
    {
        $this->authorize('view', $resume);
    
        $disk = Storage::disk('private');
    
        abort_unless(
            $disk->exists($resume->file_path),
            404
        );
    
        return $disk->response(
            $resume->file_path,
            $resume->file_name,
            [
                'Content-Type' => $resume->file_type,
                'Content-Disposition' => 'inline; filename="' .
                    addslashes($resume->file_name) .
                    '"',
            ]
        );
    }
    public function create(): Response
    {
        $this->authorize('create', Resume::class);

        return inertia('resumes/pages/Create');
    }

    public function store(StoreResumeRequest $request): RedirectResponse
    {
        $this->authorize('create', Resume::class);

        $user = $request->user();

        $file = $request->file('file');

        $path = $file->store(
            "resumes/{$user->id}",
            'private'
        );

        $isDefault = $request->boolean('is_default');

        if ($isDefault) {
            $user->resumes()->update([
                'is_default' => false,
            ]);
        }

        $user->resumes()->create([
            'title' => $request->string('title')->toString(),
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'is_default' => $isDefault,
        ]);

        return redirect()
            ->route('resumes.index')
            ->with('success', 'Resume uploaded successfully.');
    }

    public function edit(Resume $resume): Response
    {
        $this->authorize('update', $resume);

        return inertia('resumes/pages/Edit', [
            'resume' => $resume,
        ]);
    }

    public function update(
        UpdateResumeRequest $request,
        Resume $resume
    ): RedirectResponse {
        $this->authorize('update', $resume);

        $data = [
            'title' => $request->string('title')->toString(),
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            Storage::disk('private')->delete($resume->file_path);

            $data['file_path'] = $file->store(
                "resumes/{$request->user()->id}",
                'private'
            );

            $data['file_name'] = $file->getClientOriginalName();
            $data['file_type'] = $file->getClientMimeType();
            $data['file_size'] = $file->getSize();
        }

        if ($request->boolean('is_default')) {
            $request->user()->resumes()->update([
                'is_default' => false,
            ]);

            $data['is_default'] = true;
        }

        $resume->update($data);

        return redirect()
            ->route('resumes.index')
            ->with('success', 'Resume updated successfully.');
    }

    public function destroy(Resume $resume): RedirectResponse
    {
        $this->authorize('delete', $resume);

        Storage::disk('private')->delete($resume->file_path);

        $resume->delete();

        return redirect()
            ->route('resumes.index')
            ->with('success', 'Resume deleted successfully.');
    }

    public function setDefault(Resume $resume): RedirectResponse
    {
        abort_unless(
            $resume->user_id === auth()->guard()->id(),
            403
        );

        $user = auth()->guard()->user();

        $user->resumes()->update([
            'is_default' => false,
        ]);

        $resume->update([
            'is_default' => true,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Default resume updated.');
    }
}
