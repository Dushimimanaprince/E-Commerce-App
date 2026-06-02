package ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import ecommerce.models.OrderItem;
import ecommerce.models.Orders;
import ecommerce.models.Product;


@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,UUID> {

    List<OrderItem>findAllByOrders(Orders order);
    Optional<OrderItem> findByOrdersAndProduct(Orders orders, Product product);
    
    
}
