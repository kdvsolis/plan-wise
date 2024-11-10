namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use JWTAuth;
use Exception;

class ValidateToken
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Check if token is present in the Authorization header
            $user = JWTAuth::parseToken()->authenticate();  // This will automatically decode the JWT token
        } catch (Exception $e) {
            // If there's an error (invalid token or no token), return unauthorized response
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Attach the authenticated user's ID to the request
        $request->merge(['user_id' => $user->id]);

        return $next($request); // Pass the request to the next middleware or controller
    }
}
