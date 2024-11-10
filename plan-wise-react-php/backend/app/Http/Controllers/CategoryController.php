<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function createCategory(Request $request)
    {
        $user_id = $request->user()->id;  // Get user from authenticated JWT
        $category_name = $request->input('category_name');
        
        $result = $this->categoryService->createCategory($user_id, $category_name);
        return response()->json($result);
    }

    public function getCategoriesByUser(Request $request)
    {
        $user_id = $request->user()->id;
        $result = $this->categoryService->getCategoriesByUser($user_id);
        return response()->json($result);
    }

    public function getCategory(Request $request, $category_id)
    {
        $user_id = $request->user()->id;
        $result = $this->categoryService->getCategory($user_id, $category_id);
        return response()->json($result);
    }

    public function updateCategory(Request $request, $category_id)
    {
        $user_id = $request->user()->id;
        $category_name = $request->input('category_name');
        
        $result = $this->categoryService->updateCategory($user_id, $category_id, $category_name);
        return response()->json($result);
    }

    public function deleteCategory(Request $request, $category_id)
    {
        $user_id = $request->user()->id;
        $result = $this->categoryService->deleteCategory($user_id, $category_id);
        return response()->json($result);
    }
}
