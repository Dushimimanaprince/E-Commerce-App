package ecommerce.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
                                            
        Page<Product> products= productService.getAllProducts(pageable);

        return ResponseEntity.ok(products);
    }

    @PostMapping
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



   
    
}
