@extends('layouts.admin')

@section('content')
    <div class="container">
        @include('admin.includes.alerts')
        <!-- resource actions -->
        <div class="container content-section col-lg-10 offset-lg-1 mt-3 d-flex bd-highlight">
            @role('super_admin|admin')
                <a type="submit" class="btn btn-primary text-white col-3" href="{{ route('instagram.create') }}">
                    <i class="fa fa-skull-crossbones"></i>
                    Create sponsor
                </a>
            @endrole
            </div>
        <!-- table -->
        <div class="container content-section mt-3 col-lg-10 offset-lg-1">
            <table class="table table-striped ">
                <thead>
                <tr>
                    <th scope="col" class="text-center">#</th>
                    <th scope="col" class="text-center">Title</th>
                    <th scope="col" class="text-center">Link</th>
                    <th scope="col" class="text-center">Created AT</th>
                    <th scope="col" class="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                @if(count($posts) > 0)
                    @foreach($posts as $post)
                        <tr>
                            <td class="text-center">{{ $post->id }}</td>
                            <td class="text-center">{{ $post->title }}</td>
                            <td class="text-center">{{ $post->link }}</td>
                            <td class="text-center">{{ $post->created_at->format('Y/m/d H:i:s') }}</td>
                            <td>
                                <div class="container d-flex justify-content-center">
                                    @role('super_admin|admin')
                                        <a type="submit" class="btn btn-primary ml-2 text-white ms-2" href="{{ route('instagram.show', $post->id) }}">
                                            <i class="fa fa-eye"></i>
                                        </a>
                                        <a type="submit" class="btn btn-primary ml-2 text-white ms-2" href="{{ route('instagram.edit', $post->id) }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('instagram.destroy', instagram->id) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-danger ml-2 text-white ms-2">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </form>
                                    @endrole
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="4" class="text-center">No Instagram's post found</td>
                    </tr>
                @endif
                </tbody>
            </table>
            <!-- pagination -->
            <div class="row col-lg-12 d-flex justify-content-center flex-nowrap mb-3">
                {{ $posts->links() }}
            </div>
        </div>
    </div>
@endsection
