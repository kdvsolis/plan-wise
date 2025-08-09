<?php
namespace App\Services;

use App\Models\Categories;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function createCategory($user_id, $category_name)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $existingCategory = Categories::where('user_id', $user_id)->where('category_name', $category_name)->first();
        if ($existingCategory) {
            return ['success' => false, 'message' => 'Category name already exists'];
        }

        $category = Categories::create(['user_id' => $user_id, 'category_name' => $category_name]);

        return ['success' => true, 'message' => 'Category created successfully', 'category' => $category];
    }

    public function getCategoriesByUser($user_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $categories = Categories::where('user_id', $user_id)->get();

        if (!$categories) {
            return ['success' => false, 'message' => 'No categories found for the user'];
        }

        return ['success' => true, 'message' => 'Categories retrieved successfully', 'categories' => $categories];
    }

    public function getCategory($user_id, $category_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $category = Categories::where('user_id', $user_id)->where('id', $category_id)->first();
        if (!$category) {
            return ['success' => false, 'message' => 'Category not found or not owned by the user'];
        }

        return ['success' => true, 'message' => 'Category retrieved successfully', 'category' => $category];
    }

    public function updateCategory($user_id, $category_id, $category_name)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $category = Categories::where('user_id', $user_id)->where('id', $category_id)->first();
        if (!$category) {
            return ['success' => false, 'message' => 'Category not found or not owned by the user'];
        }

        $category->category_name = $category_name;
        $category->save();

        return ['success' => true, 'message' => 'Category updated successfully', 'category' => $category];
    }

    public function deleteCategory($user_id, $category_id)
    {
        $user = User::find($user_id);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }

        $category = Categories::where('user_id', $user_id)->where('id', $category_id)->first();
        if (!$category) {
            return ['success' => false, 'message' => 'Category not found or not owned by the user'];
        }

        $category->delete();
        return ['success' => true, 'message' => 'Category deleted successfully'];
    }
}
