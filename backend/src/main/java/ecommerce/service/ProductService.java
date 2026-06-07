package ecommerce.service;


import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
import ecommerce.models.Category;
import ecommerce.models.Product;
import ecommerce.models.User;
import ecommerce.repository.CategoryRepository;
import ecommerce.repository.ProductRepository;
import ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final HistoryService historyService;
    private final UserRepository userRepository;

    public Page<Product> getAllProducts(Pageable pageable){
        return productRepository.findAll(pageable);

    }
    public Page<Product> getAllActiveProducts(Pageable pageable){
        return productRepository.findByIsActiveTrue(pageable);

    }

    public Page<Product> getProductByCategory(UUID categoryId,Pageable pageable){
        Category category= categoryRepository.findById(categoryId)
            .orElseThrow(()-> new RuntimeException("The Category not Found"));

        return productRepository.findByCategory(category, pageable);
    }

    public Page<Product> getActiveProductByCategory(UUID categoryId,Pageable pageable){
        Category category= categoryRepository.findById(categoryId)
            .orElseThrow(()-> new RuntimeException("The Category not Found"));

        return productRepository.findByCategoryAndIsActiveTrue(category, pageable);
    }

    public Product createProduct(UUID categoryId,String productName,String description,double price,int quantity,String imageUrl){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        
        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The user not Found"));
        
        Category category= categoryRepository.findById(categoryId)
            .orElseThrow(()-> new RuntimeException("The Category not Found"));

        Product product= new Product();

        if(productRepository.findByProductName(productName).isPresent()){
            throw new RuntimeException("Provide Another name for the Product tis already taken");
        }
        if(price <=0){
            throw new RuntimeException("Price should be above 0");
        }

        if(quantity <=0){
            throw new RuntimeException("Quantity should be above 0");
        }
        product.setCategory(category);
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

        Product saved= productRepository.save(product);
        historyService.log("Product Saved",UserRole.ADMIN, ModelEnum.PRODUCT,user);

        return saved;
    }

    public Product updateProduct(UUID productId,String productName,String description,
                                double price,int quantity,String imageUrl){

        
        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        
        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The user not Found"));

        
        Product product= productRepository.findById(productId)
            .orElseThrow(()-> new RuntimeException("The Product not Found"));   
        
        if(!product.getProductName().equals(productName)){
            if(productRepository.findByProductName(productName).isPresent()){
                throw new RuntimeException("Provide Another name for the Product tis already taken");
            }
        }
        if(price <=0 ){
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

        Product saved= productRepository.save(product);
        historyService.log("Product Edited",UserRole.ADMIN, ModelEnum.PRODUCT,user);

        return saved;
        

        }
    
    public Product viewProductDetails(UUID productId){

        return productRepository.findById(productId)
            .orElseThrow(()-> new RuntimeException("The Product Doesn't Exist"));
    }

    
    public Product deleteProduct(UUID productId){
            Product product= productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("The product not Found"));

            String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        
            User user= userRepository.findById(UUID.fromString(userId))
                .orElseThrow(()-> new RuntimeException("The user not Found"));

                
            product.setActive(false);
            Product saved=productRepository.save(product);
            historyService.log("Product deleted"+product.getProductName(),
                                UserRole.ADMIN,ModelEnum.PRODUCT,user);
            
            return saved;
            }
    
    public List<Product> searchProduct(String name){
        return productRepository.findByProductNameContainingIgnoreCase(name);
            
    }


    public Product toggleProductStatus(UUID productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("The Product Doesn't Exist"));

        boolean currentStatus = product.isActive();
        product.setActive(!currentStatus);

        return productRepository.save(product);
    }
        
}
