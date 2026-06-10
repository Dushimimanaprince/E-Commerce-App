package ecommerce.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ecommerce.Enum.OrderStatus;
import ecommerce.models.Category;
import ecommerce.models.Product;
import ecommerce.service.CategoryService;
import ecommerce.service.HistoryService;
import ecommerce.service.LoginService;
import ecommerce.service.OrderService;
import ecommerce.service.PaymentService;
import ecommerce.service.ProductService;
import ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final LoginService loginService;
    private final CategoryService categoryService;
    private final ProductService productService;
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final UserService userService;
    private final HistoryService historyService;

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
    public ResponseEntity<?> updateCategory(@PathVariable UUID categoryId
        ,@RequestBody Map<String,String> body){
        
        try{

            Category category= categoryService.editCategory(
                categoryId,
                body.get("name"),
                body.get("description")
            );
            return ResponseEntity.ok(category);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }

    }

    @GetMapping("/products")
    public  ResponseEntity<Page<?>>getAllProducts(
                            @PageableDefault(page=0,size=10)
                            Pageable pageable){
                                            
        Page<Product> products= productService.getAllProducts(pageable);

        return ResponseEntity.ok(products);
    }

    @PostMapping("/create/products")
    public ResponseEntity<?> createProduct(@RequestBody Map<String,String>body){

        try{
            productService.createProduct(
                UUID.fromString(body.get("category")),
                body.get("productName"),
                body.get("description"),
                Double.parseDouble(body.get("price")),
                Integer.parseInt(body.get("quantity")),
                body.get("imageUrl")
            );
            return ResponseEntity.ok(Map.of("message","Item Created Successfully"));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @PutMapping("/update/products/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID productId,@RequestBody Map<String,String>body){

        try{
            productService.updateProduct(
                productId,
                body.get("productName"),
                body.get("description"),
                Double.parseDouble(body.get("price")),
                Integer.parseInt(body.get("quantity")),
                body.get("imageUrl")
            );
            return ResponseEntity.ok(Map.of(
                "message","Product Updated Successfully"));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @DeleteMapping("/delete/products/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID productId){
        try{
            return ResponseEntity.ok(productService.deleteProduct(productId));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
        @PathVariable UUID categoryId,
        @PageableDefault(page=0, size=10) Pageable pageable){
        try {
            return ResponseEntity.ok(productService.getProductByCategory(categoryId, pageable));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(){
        try {
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status){
        try {
            return ResponseEntity.ok(orderService.getOrdersByStatus(
                OrderStatus.valueOf(status.toUpperCase())
            ));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable UUID orderId,
                                            @RequestBody Map<String, String> body){
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(
                orderId,
                OrderStatus.valueOf(body.get("status").toUpperCase())
            ));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable UUID userId){
        try {
            return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments(){
        try {
            return ResponseEntity.ok(paymentService.getAllPayments());
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/payments/user/{userId}")
    public ResponseEntity<?> getUserPayments(@PathVariable UUID userId){
        try {
            return ResponseEntity.ok(paymentService.getUserPayments(userId));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/payments/details/{paymentId}")
    public ResponseEntity<?> viewDetails(@PathVariable UUID paymentId){
        try{
            return ResponseEntity.ok(paymentService.viewPaymentDetails(paymentId));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    } 

    @GetMapping("/payments/status")
    public ResponseEntity<?> getPaymentsByStatus(@RequestParam String status){
        try {
            return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/user/all")
    public ResponseEntity<?> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/user/search")
    public ResponseEntity<?> searchUsers(@RequestParam String userName){
        try{
            return ResponseEntity.ok(userService.searchUsers(userName));
        }catch(RuntimeException e){

            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }


    @GetMapping("/user/details/{userId}")
    public ResponseEntity<?> viewUserDetails(@PathVariable UUID userId){
        return ResponseEntity.ok(userService.viewUserDetails(userId));
    }


    @PutMapping("/user/set/{userId}")
    public ResponseEntity<?> setUser(@PathVariable UUID userId){
        return ResponseEntity.ok(userService.setUserActive(userId));
    }
    
    @GetMapping("/history/all")
    public ResponseEntity<?> getAllHistory(){
        return ResponseEntity.ok(historyService.viewAllHistory());
    }

    @PutMapping("/product/{productId}/toggle-active")
    public ResponseEntity<?> toggleProductActive(@PathVariable UUID productId) {
        try {
            Product updatedProduct = productService.toggleProductStatus(productId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Product status updated successfully",
                "active", updatedProduct.isActive(),    
                "isActive", updatedProduct.isActive()  
            ));
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



}
