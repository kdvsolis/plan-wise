<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AccountService;

class UserController extends Controller
{
    protected $accountService;

    public function __construct(AccountService $accountService)
    {
        $this->accountService = $accountService;
    }

    // Register new user
    public function register(Request $request)
    {
        $result = $this->accountService->register($request->name, $request->username, $request->password);
        return response()->json($result);
    }

    // Login user
    public function login(Request $request)
    {
        $result = $this->accountService->login($request->username, $request->password);
        return response()->json($result);
    }

    // Get user info
    public function get_user(Request $request)
    {
        $user = $this->accountService->get_user($request->user()->id);
        return response()->json($user);
    }

    // Update user info
    public function update_user(Request $request)
    {
        $result = $this->accountService->update_user($request->user()->id, $request->all());
        return response()->json($result);
    }
}
