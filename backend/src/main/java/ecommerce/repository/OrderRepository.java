package ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ecommerce.Enum.OrderStatus;
import ecommerce.models.Orders;
import ecommerce.models.User;


@Repository
public interface OrderRepository  extends JpaRepository<Orders,UUID>{

    List<Orders> findByUser(User user);
    List<Orders> findByActive(boolean active);
    Optional<Orders> findByOrderStatus(OrderStatus orderStatus);
}
