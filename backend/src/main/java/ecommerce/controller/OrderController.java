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

import ecommerce.models.Orders;
import ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<?> viewAllOrders(){
        try {
            return ResponseEntity.ok(orderService.viewAllOrders());
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> viewOrderDetails(@PathVariable UUID orderId){
        try {
            return ResponseEntity.ok(orderService.viewOrderDetails(orderId));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create/{productId}")
    public ResponseEntity<?> createOrder(@PathVariable UUID productId,
                                         @RequestBody Map<String, String> body){
        try {
            return ResponseEntity.ok(orderService.createOrder(
                productId,
                Integer.parseInt(body.get("quantity"))
            ));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create/from-cart")
    public ResponseEntity<?> createOrderFromCart(){
        try {
            Orders savedOrder = orderService.createOrderFromCart();
            return ResponseEntity.ok(Map.of(
                "message", "All Items Added to Orders Successfully",
                "totalPrice", savedOrder.getTotalPrice()
            ));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create/cart/{cartItemId}")
    public ResponseEntity<?> createCartOrder(@PathVariable UUID cartItemId){
        try{
            orderService.createOrderCart(cartItemId);

            return ResponseEntity.ok(Map.of("message","Product Added To Orders"));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @PutMapping("/update/{orderId}/{productId}")
    public ResponseEntity<?> updateOrder(@PathVariable UUID orderId,
                                         @PathVariable UUID productId,
                                         @RequestBody Map<String, String> body){
        try {
            return ResponseEntity.ok(orderService.editOrders(
                orderId,
                productId,
                Integer.parseInt(body.get("quantity"))
            ));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/cancel/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID orderId){
        try {
            orderService.deleteOrders(orderId);
            return ResponseEntity.ok(Map.of("message","Order Deleted Successfully"));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}