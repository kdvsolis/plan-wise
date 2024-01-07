package com.planwise.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import org.springframework.transaction.annotation.Transactional;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.http.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.Claims;
import javax.crypto.SecretKey;
import io.jsonwebtoken.Jws;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PwUserRepository userRepository;

    @Autowired
    private Environment env;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        Optional<PwUser> user = userRepository.findByEmail(loginRequest.getUsername());

        if (user.isPresent() && BCrypt.checkpw(loginRequest.getPassword(), user.get().getPassword())) {
            String secretKey = env.getProperty("app.secret-key");
            String token = JWT.create()
                    .withClaim("user_id", user.get().getId())
                    .withClaim("username", user.get().getEmail())
                    .withExpiresAt(Date.from(Instant.now().plus(60, ChronoUnit.MINUTES)))
                    .sign(Algorithm.HMAC256(secretKey));

            response.put("success", true);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest registerRequest) {
        Map<String, Object> response = new HashMap<>();
        Optional<PwUser> user = userRepository.findByEmail(registerRequest.username);

        if (user.isPresent()) {
            response.put("message", "Registration failed: Username already exists");
            return ResponseEntity.status(400).body(response);
        } else {
            try {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                String hashedPassword = passwordEncoder.encode(registerRequest.password);
                PwUser newUser = new PwUser();
                newUser.setName(registerRequest.name);
                newUser.setEmail(registerRequest.username);
                newUser.setPassword(hashedPassword);
                userRepository.save(newUser);
                response.put("message", "Registration successful");
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                response.put("message", "Registration failed: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getUser(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        String username = (String) request.getAttribute("username");
        Optional<PwUser> user = userRepository.findByEmail(username);
        if (user.isPresent()) {
            response.put("success", true);
            response.put("user", user.get());
            return ResponseEntity.ok(response);
        }
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.status(404).body(response);
    }

    @PutMapping("/user")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestBody UserRequest userRequest, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        String username = (String) request.getAttribute("username");
        Optional<PwUser> userOptional = userRepository.findByEmail(username);
        if (!userOptional.isPresent()) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    
        PwUser user = userOptional.get();
        if (userRequest.email != null) {
            user.setEmail(userRequest.email);
        }
        if (userRequest.password != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String hashedPassword = passwordEncoder.encode(userRequest.password);
            user.setPassword(hashedPassword);
        }
        if (userRequest.name != null) {
            user.setName(userRequest.name);
        }
        if (userRequest.balance != null) {
            user.setBalance(userRequest.balance);
        }
    
        userRepository.save(user);
    
        response.put("success", true);
        response.put("message", "User updated successfully");
        response.put("user", user);
        return ResponseEntity.ok(response);
    }
}
