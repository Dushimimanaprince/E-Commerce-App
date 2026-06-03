package ecommerce.controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import ecommerce.models.User;
import ecommerce.service.HistoryService;
import ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final HistoryService historyService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyDetails(){
        return ResponseEntity.ok(userService.getMyDetails()); 
    }

    @PostMapping("/edit/details")
    public ResponseEntity<?> editUser(@RequestBody Map<String,String> body){
        try {
            User updated = userService.editUser(
                body.get("fullName"), 
                body.get("phone"),
                LocalDate.parse(body.get("dob"))
            );
            return ResponseEntity.ok(updated);
        } catch (ResponseStatusException e) {
            throw e; 
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getMyHistory(){
        return ResponseEntity.ok(historyService.viewMyHistory());
    }
}