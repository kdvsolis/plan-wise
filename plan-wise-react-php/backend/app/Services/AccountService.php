<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AccountService
{
    // Handle user registration
    public function register($name, $email, $password)
    {
        if (User::where('email', $email)->exists()) {
            return ['message' => 'Registration failed: Username already exists'];
        }

        // Create a new user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        return ['message' => 'Registration successful'];
    }

    // Handle user login
    public function login($email, $password)
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return ['success' => false, 'message' => 'Invalid username or password'];
        }

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        return ['success' => true, 'token' => $token, 'user_id' => $user->id];
    }

    // Get user data by ID
    public function get_user($user_id)
    {
        $user = User::find($user_id);

        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        return ['success' => true, 'message' => 'User retrieved successfully', 'user' => $user];
    }

    // Update user data
    public function update_user($user_id, $user_data)
    {
        $user = User::find($user_id);

        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        // Update user fields
        if (isset($user_data['password'])) {
            $user_data['password'] = Hash::make($user_data['password']);
        }

        $user->update($user_data);

        return ['success' => true, 'message' => 'User updated successfully', 'user' => $user];
    }
}
