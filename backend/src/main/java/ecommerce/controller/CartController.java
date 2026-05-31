package ecommerce.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ecommerce.models.CartItem;
import ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<?> getUserCart(){
        try {
            return ResponseEntity.ok(cartService.getUserItems());
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToCart(@PathVariable UUID productId,
                                       @RequestBody Map<String, String> body){
        try {
            CartItem item = cartService.addCartItem(
                productId,
                Integer.parseInt(body.get("quantity"))
            );
            return ResponseEntity.ok(item);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable UUID cartItemId,
                                            @RequestBody Map<String, String> body){
        try {
            CartItem item = cartService.updateCartItem(
                cartItemId,
                Integer.parseInt(body.get("quantity"))
            );
            return ResponseEntity.ok(item);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable UUID cartItemId){
        try {
            return ResponseEntity.ok(cartService.deleteCartItems(cartItemId));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}