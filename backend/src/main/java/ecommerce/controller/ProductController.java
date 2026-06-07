package ecommerce.controller;


import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ecommerce.models.Product;
import ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @GetMapping
    public  ResponseEntity<Page<?>>getAllProducts(
                            @PageableDefault(page=0,size=10)
                            Pageable pageable){
                                            
        Page<Product> products= productService.getAllActiveProducts(pageable);

        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProduct(@RequestParam String name){
        try {
            return ResponseEntity.ok(productService.searchProduct(name));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
        @PathVariable UUID categoryId,
        @PageableDefault(page=0, size=10) Pageable pageable){
        try {
            return ResponseEntity.ok(productService.getActiveProductByCategory(categoryId, pageable));
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

        @GetMapping("/details/{productId}")
        public ResponseEntity<?> viewProductDetails(@PathVariable UUID productId){

            return ResponseEntity.ok(productService.viewProductDetails(productId));
        }
   
    
}
