<nav class="bg-dark text-white vh-100 col-2 sticky-top">
    <div class="sidebar-header bg-dark text-center border-bottom border-white">
        <img src="{{asset('storage/logo.png')}}" alt="logo_alt" class="img-fluid col-12 my-3">
    </div>
    <div class="mt-3 border-bottom border-white pb-3">
        <div class="container py-1">
            <i class="fas fa-user-circle fa-2x ms-3"></i>
            <span class="ms-3 mt-1">{{ ucfirst(strtolower(\Illuminate\Support\Facades\Auth::user()->name)) }}</span>
        </div>
        @env(['local', 'staging'])
        <div class="container py-1">
            <i class="fas fa-user-tag fa-lg ms-3"></i>
            <span class="ms-3">{{ \Illuminate\Support\Facades\Auth::user()->roles->first()->name }}</span>
        </div>
        @endenv
    </div>
    <ul class="pt-3 list-group list-group-flush">
        @role('super_admin|admin')
        <li class="{{ str_starts_with(request()->path(), 'admin/configurations') ? 'bg-primary' : ''  }} list-group-item bg-dark">
            <a class="text-white text-decoration-none sidebar-li" href="{{ route('configuration.index') }}">
                <i class="fas fa-cogs me-3"></i>
                Configuration
            </a>
        </li>
        @endrole
        @role('super_admin|admin')
        <li class="{{ str_starts_with(request()->path(), 'admin/players') ? 'bg-primary' : ''  }} list-group-item bg-dark">
            <a class="text-white text-decoration-none sidebar-li" href="{{ route('player.index') }}">
                <i class="fas fa-user-astronaut me-3 fa-lg"></i>
                Players
            </a>
        </li>
        @endrole
        @role('super_admin|admin')
        <li class="{{ str_starts_with(request()->path(), 'admin/sponsor') ? 'bg-primary' : ''  }} list-group-item bg-dark">
            <a class="text-white text-decoration-none sidebar-li" href="{{ route('sponsor.index') }}">
                <i class="fas fa-ribbon me-3 fa-lg"></i>
                Sponsors
            </a>
        </li>
        @endrole
    </ul>
</nav>
