package ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;


import ecommerce.Enum.PaymentStatusEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="payment_id")
    private UUID paymentId;

    @Enumerated(EnumType.STRING)
    private PaymentStatusEnum status;

    @Column(name="is_active")
    private boolean isActive;

    private double amount;

    @Column(name="transaction_id")
    private String transactionId;

    @Column(name="created_at")
    private LocalDateTime createdAt;

   
    @PrePersist
    public void prePersist(){
        this.createdAt= LocalDateTime.now();
    }

    @OneToOne
    @JoinColumn(name="order_id")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
}
