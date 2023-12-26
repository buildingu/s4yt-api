@extends('layouts.admin')

@section('content')
    <div class="container">
        <!-- title -->
        <div class="container content-section">
            <h2 class="col-lg-12 text-center">New Instagram Post</h2>
        </div>
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3">
            <a href="{{ route('sponsor.index') }}" class="btn btn-primary text-white">
                <i class="fas fa-backward mr-2"></i>
                Go back
            </a>
        </div>
        <!-- form -->
        <div class="container content-section mt-3">
            <form action="{{ route('instagram.update',$instagram->id) }}" method="POST" autocomplete="off" enctype="multipart/form-data"
                  class="col-lg-6 offset-lg-3 mb-5">
                @csrf @method('patch')
                <div class="form-group mt-2">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" id="title" name="title" value="{{ old('title') ? old('title') : $instagram->title }}"
                           aria-describedby="title">
                    @if ($errors->has('title'))
                        <small id="title"
                               class="form-text text-danger">{{ $errors->first('title') }}</small>
                    @endif
                </div>

                <div class="form-group mt-2">
                    <label for="url">Instagram post's URL</label>
                    <input type="url" class="form-control" id="url" name="url" value="{{ old('url') ? old('url') : $instagram->url }}"
                           aria-describedby="title">
                    @if ($errors->has('url'))
                        <small id="url"
                               class="form-text text-danger">{{ $errors->first('url') }}</small>
                    @endif
                </div>

                <div class="form-group mt-3">
                    <button type="submit" class="btn btn-primary col-lg-12 text-white fw-bold">Update</button>
                </div>
            </form>
        </div>
    </div>

@endsection

