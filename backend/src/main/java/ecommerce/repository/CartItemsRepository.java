package ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce.models.Cart;
import ecommerce.models.CartItem;

public interface CartItemsRepository extends JpaRepository<CartItem,UUID> {

    List<CartItem> findByCart(Cart cart);
    
}
