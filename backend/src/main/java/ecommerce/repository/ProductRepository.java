package ecommerce.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce.models.Category;
import ecommerce.models.Product;

public interface ProductRepository extends JpaRepository<Product,UUID>{

    Optional<Product> findByProductName(String productName);
    Page<Product> findByCategory(Category category, Pageable pageable);
    Page<Product> findAll(Pageable pegeable);
    
}
