<?php

namespace App\Http\Controllers;

use App\Http\Requests\Instagram\StoreRequest;
use App\Models\Instagram;
use App\Services\InstagramService;
use Illuminate\Http\Request;

class InstagramController extends Controller
{
    public function index()
    {
        $posts = Instagram::query()->orderBy('created_at')->paginate(10);
        return view('admin.instagram.index',compact('posts'));
    }

    public function create()
    {
        return view('admin.instagram.create');
    }

    public function store(StoreRequest $request)
    {
        $instagram_post = (new InstagramService())->create($request->all());
        return redirect()->route('instagram.index')->with('success', 'Instagram post created successfully.');
    }

    public function edit(Instagram $instagram)
    {
        return view('admin.instagram.edit',compact('instagram'));
    }

    public function update(StoreRequest $request, $id)
    {
        (new InstagramService())->update($id,$request->all());
        return redirect()->route('instagram.index')->with('success', 'Instagram post updated successfully.');
    }

    public function destroy($id)
    {
        (new InstagramService())->destroy($id);
        return redirect()->route('instagram.index')->with('success', 'Instagram post removed successfully.');
    }
}
