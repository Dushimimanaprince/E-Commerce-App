package ecommerce.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ecommerce.models.User;
import ecommerce.service.LoginService;
import ecommerce.service.RegisterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RegisterService registerService;
    private final LoginService loginService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body){
        try {
            User saved = registerService.registerUser(
                body.get("fullName"),
                body.get("email"),
                body.get("phone"),
                LocalDate.parse(body.get("dob")),
                body.get("password")
            );
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body){
        try {
            registerService.verifyRegisteringUser(
                body.get("email"),
                body.get("code")
            );
            return ResponseEntity.ok(Map.of("message", "Account verified successfully"));
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body, HttpServletRequest request){

        try{
            Map<String,String> response= loginService.login(
                body.get("email"),
                body.get("password"),
                request
            );
            return ResponseEntity.ok(response);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }
}