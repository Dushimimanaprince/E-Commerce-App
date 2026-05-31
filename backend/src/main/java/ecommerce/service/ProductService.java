package ecommerce.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ecommerce.models.Product;
import ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;;

    public Page<Product> getAllProducts(Pageable pageable){
        return productRepository.findAll(pageable);

    }
    
    
}
