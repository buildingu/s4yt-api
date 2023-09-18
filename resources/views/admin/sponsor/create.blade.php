@extends('layouts.admin')

@section('content')
    <div class="container">
        <!-- title -->
        <div class="container content-section">
            <h2 class="col-lg-12 text-center">New Sponsor</h2>
        </div>
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3">
            <a href="{{ route('player.index') }}" class="btn btn-primary text-white">
                <i class="fas fa-backward mr-2"></i>
                Go back
            </a>
        </div>
        <!-- form -->
        <div class="container content-section mt-3">
            <form action="{{ route('sponsor.store') }}" method="POST" autocomplete="off" enctype="multipart/form-data"
                  class="col-lg-6 offset-lg-3 mb-5">
                @csrf
                <div class="form-group mt-2">
                    <label for="name">Short Description</label>
                    <input type="text" class="form-control" id="name" name="short_description"
                           aria-describedby="short_description_error">
                    @if ($errors->has('short_description'))
                        <small id="short_description_error"
                               class="form-text text-danger">{{ $errors->first('short_description') }}</small>
                    @endif
                </div>

                <div class="form-group mt-2">
                    <label for="education">Status</label>
                    <select class="form-select form-control" aria-label="Default select example" id="status"
                            name="status">
                        <option value="" selected>Choose status for this sponsor</option>
                        <option value="0">Deactivate</option>
                        <option value="1">active</option>
                    </select>
                    @if ($errors->has('status'))
                        <small id="status" class="form-text text-danger">{{ $errors->first('status') }}</small>
                    @endif
                </div>

                <div class="form-group mt-2">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" name="description" aria-describedby="description" ></textarea>
                    @if ($errors->has('description'))
                        <small id="name_error" class="form-text text-danger">{{ $errors->first('description') }}</small>
                    @endif
                </div>
                <div class="form-group mt-2">
                    <label for="name">Image (Required)</label>
                    <input type="file" class="form-control" id="image" name="image"
                           aria-describedby="short_description_error">
                    @if ($errors->has('image'))
                        <small id="short_description_error"
                               class="form-text text-danger">{{ $errors->first('image') }}</small>
                    @endif
                </div>

                <div class="form-group mt-3">
                    <button type="submit" class="btn btn-primary col-lg-12 text-white fw-bold">Submit</button>
                </div>
            </form>
        </div>
    </div>

@endsection

