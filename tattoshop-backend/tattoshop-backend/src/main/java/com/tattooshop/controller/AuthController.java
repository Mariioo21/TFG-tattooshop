package com.tattooshop.controller;

import com.tattooshop.dto.JwtResponse;
import com.tattooshop.dto.LoginRequest;
import com.tattooshop.dto.RegisterRequest;
import com.tattooshop.entity.ERole;
import com.tattooshop.entity.User;
import com.tattooshop.service.UserService;
import com.tattooshop.service.UserDetailsServiceImpl;
import com.tattooshop.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error de autenticación: " + e.getMessage());
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String jwt = jwtUtil.generateToken(userDetails);

        User user = userService.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de autenticar"));

        String role = (user.getRole() != null) ? user.getRole().name() : "USER";
        JwtResponse response = new JwtResponse(jwt, user.getId(), user.getUsername(), role);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {

        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: username ya en uso");
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: email ya en uso");
        }

        // Determinar rol a asignar
        ERole assignedRole = ERole.USER; // por defecto
        if (signUpRequest.getRole() != null) {
            String inputRole = signUpRequest.getRole().trim().toUpperCase();
            switch (inputRole) {
                case "ADMIN" -> assignedRole = ERole.ADMIN;
                case "SELLER" -> assignedRole = ERole.SELLER;
                default -> assignedRole = ERole.USER;
            }
        }

        User newUser = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getPassword(),
                assignedRole
        );

        userService.save(newUser);
        return ResponseEntity.ok("Usuario registrado exitosamente como " + assignedRole.name());
    }
}
