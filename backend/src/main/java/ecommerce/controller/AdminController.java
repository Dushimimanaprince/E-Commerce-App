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
import org.springframework.web.bind.annotation.RestController;

import ecommerce.models.Category;
import ecommerce.models.Product;
import ecommerce.service.CategoryService;
import ecommerce.service.LoginService;
import ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final LoginService loginService;
    private final CategoryService categoryService;
    private final ProductService productService;

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
            Product product= productService.createProduct(
                body.get("productName"),
                body.get("description"),
                Double.parseDouble(body.get("price")),
                Integer.parseInt(body.get("quantity")),
                body.get("imageUrl")
            );
            return ResponseEntity.ok(product);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }

    @PutMapping("/update/products/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID productId,@RequestBody Map<String,String>body){

        try{
            Product product= productService.updateProduct(
                productId,
                body.get("productName"),
                body.get("description"),
                Double.parseDouble(body.get("price")),
                Integer.parseInt(body.get("quantity")),
                body.get("imageUrl")
            );
            return ResponseEntity.ok(product);
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

}
