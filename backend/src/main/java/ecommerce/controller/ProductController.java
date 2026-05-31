package ecommerce.controller;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

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
                                            
        Page<Product> products= productService.getAllActiveProducts(pageable);

        return ResponseEntity.ok(products);
    }





   
    
}
