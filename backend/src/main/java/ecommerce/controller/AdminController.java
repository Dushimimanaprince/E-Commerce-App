package ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ecommerce.service.LoginService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final LoginService loginService;

    @GetMapping("/logins")
    public ResponseEntity<?> getAllLogins(){
        return ResponseEntity.ok(loginService.getAllLogins());
    }
}
