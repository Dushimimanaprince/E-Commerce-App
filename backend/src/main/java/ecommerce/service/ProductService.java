package ecommerce.service;


import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ecommerce.models.Category;
import ecommerce.models.Product;
import ecommerce.repository.CategoryRepository;
import ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<Product> getAllProducts(Pageable pageable){
        return productRepository.findAll(pageable);

    }

    public Page<Product> getProductByCategory(UUID categoryId,Pageable pageable){
        Category category= categoryRepository.findById(categoryId)
            .orElseThrow(()-> new RuntimeException("The Category not Found"));

        return productRepository.findByCategory(category, pageable);
    }

    public Product createProduct(String productName,String description,double price,int quantity,String imageUrl){

        Product product= new Product();

        if(product.getProductName().matches(productName)){
            throw new RuntimeException("Provide Another name for the Product tis already taken");
        }
        if(price <=0){
            throw new RuntimeException("Price should be above 0");
        }

        if(quantity <=0){
            throw new RuntimeException("Quantity should be above 0");
        }

        product.setProductName(productName);
        if(description != null && !description.isBlank()){
            product.setDescription(description);
        }
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setActive(true);

        if(imageUrl != null && !imageUrl.isBlank()){
            product.setImageUrl(imageUrl);
        }

        return productRepository.save(product);
    }
    
}
