<!-- alerts -->
<div class="row content-section">
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show col-lg-10 offset-lg-1" role="alert">
            <strong>{{ session('success') }}</strong>
        </div>
    @endif
    @if(session('error'))
        <div class="alert alert-danger alert-dismissible fade show col-lg-10 offset-lg-1" role="alert">
            <strong>{{ session('error') }}</strong>
        </div>
    @endif
</div>
