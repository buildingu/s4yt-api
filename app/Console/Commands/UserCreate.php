<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Backpack\PermissionManager\app\Models\Role;
use App\Models\User;

class UserCreate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command to create new user';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $data = [];
        
        //set data
        $data['name'] = $this->ask('Name:');
        $data['email'] = $this->ask('Email Address:');
        $data['password'] = Hash::make($this->secret('Password:'));

        //create user
        $user = User::create($data);

        $this->info('User created successfully!');

        return Command::SUCCESS;
    }
}
