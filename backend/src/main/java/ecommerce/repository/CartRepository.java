package ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ecommerce.models.Cart;
import ecommerce.models.User;

@Repository
public interface CartRepository extends JpaRepository<Cart,UUID> {

    List<Cart> findByUser(User user);
    
}
