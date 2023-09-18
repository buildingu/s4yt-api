<?php

namespace App\Http\Controllers;

use App\Http\Requests\Sponsor\StoreRequest;
use App\Models\SponsorPartner;
use App\Models\User;
use Illuminate\Http\Request;

class SponsorPartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $sponsors = SponsorPartner::query()->orderByDesc('created_at')->paginate(10);
        return view('admin.sponsor.index',compact('sponsors'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.sponsor.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRequest $request)
    {
        $image = $request->file('image');
        $imageName = time().'.'.$image->getClientOriginalExtension();
        $path = 'app/public/sponsors';
        $image->move(storage_path($path),$imageName);
        SponsorPartner::query()->create([
            'short_description' => $request->input('short_description'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
            'image' => $imageName,
        ]);
        return redirect()->route('sponsor.index')->with('success', 'Sponsor created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $sponsor = $this->getSponsor($id);
        return view('admin.sponsor.show',compact('sponsor'));
    }

    private function getSponsor($id)
    {
        return SponsorPartner::query()->findOrFail($id);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $sponsor = $this->getSponsor($id);
        return view('admin.sponsor.edit',compact('sponsor'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Store $request, $id)
    {
        $sponsor = $this->getSponsor($id);
        $sponsor->update([
            'short_description' => $request->input('short_description'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
        ]);
        $image = $request->file('image');
        if ($image){
            $path = $this->removeExistImage($sponsor);
            $imageName = time().'.'.$image->getClientOriginalExtension();
            $image->move(storage_path($path),$imageName);

            $sponsor->update([
            'image' => $imageName,
            ]);
        }
        return redirect()->route('sponsor.index')->with('success', 'Sponsor Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $sponsor = $this->getSponsor($id);
        $this->removeExistImage($sponsor);
        $sponsor->delete();
        return redirect()->route('sponsor.index')->with('success', 'Sponsor deleted successfully.');
    }

    /**
     * @param $sponsor
     * @return string
     */
    private function removeExistImage($sponsor): string
    {
        $path = 'app/public/sponsors';
        if (file_exists(storage_path($path . '/' . $sponsor->image))) {
            unlink(storage_path($path . '/' . $sponsor->image));
        }
        return $path;
    }
}
