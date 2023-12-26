    @extends('layouts.admin')

@section('content')

    <div class="container">
        <!-- title -->
        <div class="container content-section">
            <h2 class="col-lg-12 text-center">Edit {{ $config->key }}</h2>
        </div>
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3">
            <a href="{{ route('configuration.index') }}" class="btn btn-primary text-white">
                <i class="fas fa-backward mr-2"></i>
                Go back
            </a>
        </div>
        <!-- form -->
        <div class="container content-section mt-3">
            <form action="{{ route('configuration.update',['configuration'=>$config->id]) }}" method="POST" class="col-lg-6 offset-lg-3 mb-5">
                @csrf
                @method('PUT')
                <div class="form-group">
                    <label for="key">Key</label>
                    <input type="text" class="form-control" id="key" name="key" value="{{ $config->key }}" readonly>
                </div>
                <div class="form-group mt-3">
                    <label for="value">Value</label>
                    <input type="{{ $config->type->id === 1 ? 'number' : 'datetime-local' }}" class="form-control" id="value" name="value" aria-describedby="value_error" value="{{ $config->versions ? $config->versions->value : null }}">
                    @if ($errors->has('value'))
                        <small id="value_error" class="form-text text-danger">{{ $errors->first('value') }}</small>
                    @endif
                </div>
                <div class="form-group mt-3">
                    <label for="description">Description</label>
                    <textarea rows="4" readonly class="form-control" id="description" name="description">{{ $config->description }}</textarea>
                </div>
                <div class="form-group mt-3">
                    <input type="hidden" name="_method" value="patch" />
                    <button type="submit" class="btn btn-primary col-lg-12 fw-bold text-white">Submit</button>
                </div>
            </form>
        </div>
    </div>

@endsection
