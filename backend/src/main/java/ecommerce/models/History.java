package ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;

import ecommerce.Enum.UserRole;
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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="history")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="history_id")
    private UUID historyId;

    private String action;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String model;

    @Column(name="created_at")
    private LocalDateTime createdAt;
   
    @PrePersist
    public void prePersist(){
        this.createdAt= LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name="user_id",nullable = true)
    private User user;

    
}
