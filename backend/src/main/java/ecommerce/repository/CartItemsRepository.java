package ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce.models.Cart;
import ecommerce.models.CartItem;
import ecommerce.models.Product;

public interface CartItemsRepository extends JpaRepository<CartItem,UUID> {

    List<CartItem> findByCart(Cart cart);
    List<CartItem> findByCartAndIsActiveTrue(Cart cart);
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    
}
