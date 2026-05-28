package ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;

import ecommerce.Enum.ModelEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="verifications")
public class Verification {

    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="verification_id")
    private UUID verificationId;

    @Column(nullable = false)
    private String code;

    @Column(name="is_used")
    private boolean isUsed;

    @Column(name="entity_id")
    private UUID entityId;

    private ModelEnum model;

    @Column(name="created_at")
    private LocalDateTime createdAt;
   
    @PrePersist
    public void prePersist(){
        this.createdAt= LocalDateTime.now();
    }

    public boolean isExpired(){
        return createdAt.plusMinutes(10)
            .isBefore(LocalDateTime.now());
            }

    
}
