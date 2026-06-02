package ecommerce.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce.Enum.PaymentStatus;
import ecommerce.models.Orders;
import ecommerce.models.Payment;

public interface PaymentRepository extends JpaRepository<Payment,UUID>{

    Optional<Payment> findByOrder(Orders order);
    Optional<Payment> findByOrderAndUser(Orders order);
    Optional<Payment> findByStatus(PaymentStatus status);
    
}
