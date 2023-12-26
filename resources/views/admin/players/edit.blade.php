@extends('layouts.admin')

@section('content')

    <div class="container">
        <!-- title -->
        <div class="container content-section">
            <h2 class="col-lg-12 text-center">Edit {{ $user->name }}'s info</h2>
        </div>
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3 d-flex justify-content-between">
            <a href="{{ route('player.index') }}" class="btn btn-primary text-white">
                <i class="fas fa-backward mr-2"></i>
                Go back
            </a>
        </div>
        <!-- form -->
        <div class="container content-section mt-3">
            <form action="{{ route('player.update',['player'=>$user -> id]) }}" method="POST" autocomplete="off" novalidate class="col-lg-6 offset-lg-3 mb-5">
                @csrf
                @method('PUT')
                <div class="form-group mt-2">
                    <label for="name">Name (Required)</label>
                    <input type="text" class="form-control" id="name" name="name" aria-describedby="name_error" value="{{ $user->name }}">
                    @if ($errors->has('name'))
                        <small id="name_error" class="form-text text-danger">{{ $errors->first('name') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2">
                    <label for="email">Email (Required)</label>
                    <input type="email" class="form-control" id="email" name="email" aria-describedby="email_error" value="{{ $user->email }}">
                    @if ($errors->has('email'))
                        <small id="email_error" class="form-text text-danger">{{ $errors->first('email') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2">
                    <label for="education">Education</label>
                    <select class="form-select form-control" aria-label="Default select example" id="education" name="education">
                        <option value="0">Choose an option</option>
                        @foreach($educations as $education)
                            <option value="{{ $education->id }}" {{ $education->id == $player->education_id ? "selected" : "" }}>{{ $education->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group mt-2" id="instagram_input">
                    <label for="instagram_input">Instagram</label>
                    <input type="text" class="form-control" id="instagram_input" name="instagram" value="{{ $player->instagram }}">
                    @if ($errors->has('instagram'))
                        <small id="institution_error" class="form-text text-danger">{{ $errors->first('instagram') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2">
                    <label for="grade">Grade (Required)</label>
                    <select class="form-select form-control" aria-label="Default select example" id="grade" name="grade">
                        <option value="0" selected>Choose an option</option>
                        @foreach($grades as $grade)
                            <option value="{{ $grade->id }}" {{$grade->id == $player->grade_id ? "selected" : "" }}>{{ $grade->name }}</option>
                        @endforeach
                    </select>
                    @if ($errors->has('grade'))
                        <small id="grade_error" class="form-text text-danger">{{ $errors->first('grade') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2">
                    <label for="country">Country (Required)</label>
                    <input type="text" id="country_iso" name="country_iso" hidden>
                    <input type="text" class="form-control" list="countries" id="country" name="country" aria-describedby="country_error" value="{{ $form_data['country_name'] }}" data-iso="{{ $player->country_iso }}">
                    <datalist id="countries">
                        @foreach($form_data['countries'] as $country)
                            <option value="{{ $country['name'] }}" data-iso="{{ $country['iso2'] }}"></option>
                        @endforeach
                    </datalist>
                    @if ($errors->has('country'))
                        <small id="country_error" class="form-text text-danger">{{ $errors->first('country') }}</small>
                    @endif
                </div>

                <div class="form-group mt-2">
                    <label for="state">Province/State (Required) <i class="fas fa-spinner fa-spin-pulse" id="state-spinner"></i></label>
                    <select class="form-select form-control" id="state" name="state" aria-describedby="state_error" data-iso={{ $player->state_iso }} disabled>
                        <option value="0">Select a province/state...</option>
                    </select>
                    @if ($errors->has('state'))
                        <small id="state_error" class="form-text text-danger">{{ $errors->first('state') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2">
                    <label for="city">City (Required) <i class="fas fa-spinner fa-spin-pulse" id="city-spinner"></i></label>
                    <select class="form-select form-control" id="city" name="city" aria-describedby="city_error" disabled data-id={{ $player->city_id }}>
                        <option value="0" selected>Select a city...</option>
                    </select>
                    @if ($errors->has('city'))
                        <small id="city_error" class="form-text text-danger">{{ $errors->first('city') }}</small>
                    @endif
                </div>
                <!--div class="form-group mt-2">
                    <label for="role">Role (Required)</label>
                    <select class="form-select form-control" aria-label="Default select example" id="role" name="role">
                        <option value="0">Choose an option</option>
                        @foreach($roles as $role)
                            <option value="{{ $role->name }}" {{$role->name == $user->getRoleNames()->first() ? "selected" : "" }}>{{ $role->name }}</option>
                        @endforeach
                    </select>
                    @if ($errors->has('role'))
                        <small id="role_error" class="form-text text-danger">{{ $errors->first('role') }}</small>
                    @endif
                </div-->
                <div class="form-group mt-3">
                    <button type="submit" class="btn btn-primary col-lg-12 text-white fw-bold">Submit</button>
                </div>
            </form>
        </div>
    </div>
@endsection

@section('footer_scripts')
    $(document).ready(function(){

        // Hide at load page
        $('#education').value == 1 ? $("#institution_input").show() :  $("#institution_input").hide();
        $("#state-spinner").hide();
        $("#city-spinner").hide();

        // Conditional for display
        $('#education').on('change', function() {
            this.value == 1 ? $("#institution_input").show() :  $("#institution_input").hide();
        });

        $('#country').ready(function(){

            // Constants definitions
            const stateSpinner = $("#state-spinner");
            const stateSelect = $("#state");
            const citySpinner = $("#city-spinner");
            const citySelect = $("#city");

            // Show loader
            stateSpinner.show();
            // Get data
            const ciso = $('#country').data('iso');
            const siso = $('#state').data('iso');
            const city_id =  $('#city').data('id');
            const country_iso_input = $("#country_iso");
            country_iso_input.val(ciso);

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                type:'GET',
                url:"{{ route('location.states') }}",
                data:{ciso:ciso},
                success:function(data){
                    let states = data.data.states;
                    $.each(states, function(i, state) {
                        if(state.iso2 == siso) {
                            stateSelect.append(
                            '<option value="' + state.iso2 + '" selected>' +  state.name + '</option>');
                        } else {
                            stateSelect.append(
                                '<option value="' + state.iso2 + '">' +  state.name + '</option>');
                        }
                    });
                    // Hide spinner
                    stateSpinner.hide();
                    // Enable select
                    stateSelect.prop('disabled', false);
                }
            });

            // Show loader
            citySpinner.show();

            $.ajax({
                type:'GET',
                url:"{{ route('location.cities') }}",
                data:{ciso:ciso, siso:siso},
                success:function(data){
                    let cities = data.data.cities;
                    $.each(cities, function(i, city) {
                        console.log(city.id, city_id);
                        if(city.id == city_id) {
                            citySelect.append('<option value="' + city.id + '" selected>' +  city.name + '</option>');
                        } else {
                            citySelect.append('<option value="' + city.id + '">' +  city.name + '</option>');
                        }

                    });
                    // Hide spinner
                    citySpinner.hide();
                    // Enable select
                    citySelect.prop('disabled', false);
                }
            });

        });

        $('#country').on('input', function(){

            // Get option from DOM
            const option = $('#countries [value="' + $(this).val() + '"]');
            // Constants definitions
            const stateSpinner = $("#state-spinner");
            const stateSelect = $("#state");
            const citySelect = $("#city");
            // Disabled state input
            stateSelect.prop('disabled', true);
            citySelect.prop('disabled', true);
            // Remove potential children except first
            $("#state option").slice(1).remove();
            $("#city option").slice(1).remove();

            // Check option is valid
            if(option.length == 1){

                // Show loader
                stateSpinner.show();
                // Get data
                const ciso = option.data('iso');

                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

                $.ajax({
                    type:'GET',
                    url:"{{ route('location.states') }}",
                    data:{ciso:ciso},
                    success:function(data){
                        let states = data.data.states;
                        $.each(states, function(i, state) {
                            stateSelect.append('<option value="' + state.iso2 + '">' +  state.name + '</option>');
                        });
                        // Hide spinner
                        stateSpinner.hide();
                        // Enable select
                        stateSelect.prop('disabled', false);
                    }
                });
            }
        });




        $('#state').on('change', function(){

            // Get option from DOM
            const option = $('#countries [value="' + $("#country").val() + '"]');
            // Constants definitions
            const citySpinner = $("#city-spinner");
            const citySelect = $("#city");
            // Disabled city input
            citySelect.prop('disabled', true);
            // Remove potential children except first
            $("#city option").slice(1).remove();
            const state = $(this);

            if(state.val() !== "0") {

                // Show loader
                citySpinner.show();
                // Get data
                const ciso = option.data('iso');
                const siso = state.val();

                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

                $.ajax({
                    type:'GET',
                    url:"{{ route('location.cities') }}",
                    data:{ciso:ciso, siso:siso},
                    success:function(data){
                        let cities = data.data.cities;
                        $.each(cities, function(i, city) {
                        citySelect.append('<option value="' + city.id + '">' +  city.name + '</option>');
                        });
                        // Hide spinner
                        citySpinner.hide();
                        // Enable select
                        citySelect.prop('disabled', false);
                    }
                });
            }
        });
    });
@endsection

