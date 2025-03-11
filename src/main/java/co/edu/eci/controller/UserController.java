package co.edu.eci.controller;

import co.edu.eci.model.User;
import co.edu.eci.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "https://taller6arep.duckdns.org", allowedHeaders = "*", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Error: El nombre de usuario ya está en uso.");
        }

        // Crea un nuevo usuario
        userService.createUser(user.getUsername(), user.getPassword());
        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        boolean isAuthenticated = userService.authenticate(user.getUsername(), user.getPassword());
        if (isAuthenticated) {
            return ResponseEntity.ok("Login exitoso.");
        } else {
            return ResponseEntity.status(401).body("Error: Credenciales inválidas.");
        }
    }
}