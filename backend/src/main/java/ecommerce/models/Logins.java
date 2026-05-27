package ecommerce.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

@AllArgsConstructor
@NoArgsConstructor
@Table(name="logins")
public class Logins {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="login_id")
    private UUID loginId;

    @Column(name="ip_address", nullable =false)
    private String ipAddress;

    @Column(name="device_info", nullable = true, length = 1000)
    private String deviceInfo;

    @Column(name="created_at")
    private LocalDateTime createdAt;
   
    @PrePersist
    public void prePersist(){
        this.createdAt= LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;


    
}
