package ecommerce.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ecommerce.models.Category;
import ecommerce.service.CategoryService;
import ecommerce.service.LoginService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final LoginService loginService;
    private final CategoryService categoryService;

    @GetMapping("/logins")
    public ResponseEntity<?> getAllLogins(){
        return ResponseEntity.ok(loginService.getAllLogins());
    }

    @PostMapping("/add/category")
    public ResponseEntity<?> createCategory(@RequestBody Map<String,String> body){
        try{
            Category category= categoryService.createCategory(
                body.get("name"),
                body.get("description")
            );
            return ResponseEntity.ok(category);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @PutMapping("/update/category/{categoryId}")
    public ResponseEntity<?> updateCategory(@PathVariable UUID id
        ,@RequestBody Map<String,String> body){
        
        try{

            Category category= categoryService.editCategory(
                id,
                body.get("name"),
                body.get("description")
            );
            return ResponseEntity.ok(category);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }

    }
}
