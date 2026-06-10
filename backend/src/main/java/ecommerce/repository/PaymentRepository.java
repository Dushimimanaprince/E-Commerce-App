package ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ecommerce.Enum.PaymentStatusEnum;
import ecommerce.models.Orders;
import ecommerce.models.Payment;
import ecommerce.models.User;

public interface PaymentRepository extends JpaRepository<Payment,UUID>{

    Optional<Payment> findByOrder(Orders order);
    Optional<Payment> findByOrderAndUser(Orders order ,User user);
    List<Payment> findByStatus(PaymentStatusEnum status);
    List<Payment> findAllByUser(User user);

    @Query("SELECT p FROM Payment p WHERE LOWER(CAST(p.status AS string)) LIKE LOWER(CONCAT('%', :status, '%'))")
    List<Payment> findByStatusContainingIgnoreCase(@Param("status") String status);

    
}
