<?php

namespace App\Http\Controllers;

use App\Http\Requests\Sponsor\StoreRequest;
use App\Http\Requests\Sponsor\UpdateRequest;
use App\Models\SponsorPartner;
use App\Models\User;
use App\Services\SponsorPartnerService;
use Illuminate\Http\Request;

class SponsorPartnerController extends Controller
{
    public function index()
    {
        $sponsors = (new SponsorPartnerService())->getAllSponsors();
        return view('admin.sponsor.index', compact('sponsors'));
    }

    public function create()
    {
        return view('admin.sponsor.create');
    }

    public function store(StoreRequest $request)
    {
        $data = $request->all();
        (new SponsorPartnerService())->createSponsor($data);
        return redirect()->route('sponsor.index')->with('success', 'Sponsor created successfully.');
    }

    public function show($id)
    {
        $sponsor = (new SponsorPartnerService())->getSponsorById($id);
        return view('admin.sponsor.show', compact('sponsor'));
    }

    public function edit($id)
    {
        $sponsor = (new SponsorPartnerService())->getSponsorById($id);
        return view('admin.sponsor.edit', compact('sponsor'));
    }

    public function update(UpdateRequest $request, $id)
    {
        $data = $request->all();
        $sponsor = (new SponsorPartnerService())->getSponsorById($id);
        (new SponsorPartnerService())->updateSponsor($sponsor, $data);
        return redirect()->route('sponsor.index')->with('success', 'Sponsor Updated successfully.');
    }

    public function destroy($id)
    {
        $sponsor = (new SponsorPartnerService())->getSponsorById($id);
        (new SponsorPartnerService())->deleteSponsor($sponsor);
        return redirect()->route('sponsor.index')->with('success', 'Sponsor deleted successfully.');
    }

}
