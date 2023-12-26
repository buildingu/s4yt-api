@extends('layouts.admin')

@section('content')
    <div class="container">
        <!-- title -->
        <div class="container content-section">
            <h2 class="col-lg-12 text-center">New Coins to User</h2>
        </div>
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3">
            <a href="{{ route('coin.index',['player'=>$user->id]) }}" class="btn btn-primary text-white">
                <i class="fas fa-backward mr-2"></i>
                Go back
            </a>
        </div>
        <!-- form -->
        <div class="container content-section mt-3">
            <form action="{{ route('coin.store',['player'=>$user->id]) }}" method="POST" autocomplete="off" class="col-lg-6 offset-lg-3 mb-5">
                @csrf
                <div class="form-group mt-2">
                    <label for="type">Type</label>
                    <select class="form-select form-control" aria-label="Default select example" id="type" name="type">
                        <option value="0" selected>Choose an option</option>
                        @foreach($coinTypes as $coinType)
                            <option value="{{ $coinType->id }}">{{ ucWords($coinType->event) }}</option>
                        @endforeach
                    </select>
                    @if ($errors->has('type'))
                        <small class="form-text text-danger">{{ $errors->first('type') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2" style="display:none">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" name="description" aria-describedby="amount_error" disabled></textarea>
                    @if ($errors->has('description'))
                        <small id="name_error" class="form-text text-danger">{{ $errors->first('description') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2">
                    <label for="amount">Amount</label>
                    <input type="number" class="form-control" id="amount" name="amount" aria-describedby="amount_error">
                    @if ($errors->has('amount'))
                        <small class="form-text text-danger">{{ $errors->first('amount') }}</small>
                    @endif
                </div>
                <div class="form-group mt-3">
                    <button type="submit" class="btn btn-primary col-lg-12 text-white fw-bold">Submit</button>
                </div>
            </form>
        </div>
    </div>

@endsection

@section('footer_scripts')

    $(document).ready(function(){
        $('#type').on('change', function(){
            const description = $('#description');
            const state = $(this);

            if(state.val() == 3) {
                description.parent().show();
                description.removeAttr('disabled');
            }else{
                description.parent().hide();
                description.attr('disabled');
            }
        });
    });

@endsection