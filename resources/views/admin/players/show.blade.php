@extends('layouts.admin')

@section('content')
    <div class="container">
        <!-- table -->
        <div class="container content-section mt-3 col-lg-10 offset-lg-1">
                <table class="table table-striped ">
                    <thead>
                    <tr>
                        <th scope="col">Traits</th>
                        <th scope="col">Description</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td scope="col">Name</td>   
                            <td scope="col">{{ $user->name }}</td>  
                        </tr>
                        <tr>
                            <td scope="col">Email</td>  
                            <td scope="col">{{ $user->email }}</td>    
                        </tr>
                        <tr>
                            <td scope="col">Email Verified</td>  
                            <td scope="col">
                                
                                @if(isset($player->email_verified_at))
                                <span class="text-success">YES</span>
                                @else
                                <span class="text-danger">NO</span>
                                @endif
                            
                            <td>
                        </tr>
                        <tr>
                            <td scope="col">Education</td>  
                            <td scope="col">{{ $player->education->name }}</td>    
                        </tr>
                        <tr>
                            <td scope="col">Grade</td>  
                            <td scope="col">{{ $player->grade->name }}</td>    
                        </tr>
                        <tr>
                            <td scope="col">Country</td>  
                            <td scope="col">{{ $form_data['country_name'] }}</td>    
                        </tr>
                        <tr>
                            <td scope="col">State</td>  
                            <td scope="col">{{ $form_data['state_name'] }}</td>    
                        </tr>
                        <tr>
                            <td scope="col">City</td>  
                            <td scope="col">{{ $form_data['city_name'] }}</td>    
                        </tr>
                    </tbody>
        </div>
    </div>
@endsection