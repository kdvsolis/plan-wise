package com.planwise.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import javax.crypto.SecretKey;
import io.jsonwebtoken.Jws;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private Environment env;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader("Authorization");
        String secretKeyString = env.getProperty("app.secret-key");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            byte[] keyBytes = secretKeyString.getBytes(StandardCharsets.UTF_8);
            SecretKey secretKey = Keys.hmacShaKeyFor(keyBytes);
            Jws<Claims> jwtClaims = Jwts.parser().setSigningKey(secretKey).build().parseClaimsJws(jwt);
            String username = jwtClaims.getBody().get("username", String.class);
            Integer user_id = jwtClaims.getBody().get("user_id", Integer.class);
            request.setAttribute("username", username);
            request.setAttribute("user_id", user_id);
        }
        return true;
    }
}
