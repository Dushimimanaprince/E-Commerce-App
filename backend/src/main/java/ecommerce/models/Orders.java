package ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;

import ecommerce.Enum.OrderStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="order_id")
    private UUID OrderId;

    @Enumerated(EnumType.STRING)
    @Column(name="order_status")
    private OrderStatus orderStatus;

    @Column(name="total_price")
    private double totalPrice;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name="is_active")
    private boolean active;

    public boolean isExpired(){
        return createdAt.plusDays(7)
            .isBefore(LocalDateTime.now());
    }

   
    @PrePersist
    public void prePersist(){
        this.createdAt= LocalDateTime.now();
        this.updatedAt= LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate(){
        this.updatedAt= LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    
}
