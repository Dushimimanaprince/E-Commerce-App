package ecommerce.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ecommerce.models.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category,UUID> {

    Optional<Category> findByCategoryName(String categoryName);
    
}
