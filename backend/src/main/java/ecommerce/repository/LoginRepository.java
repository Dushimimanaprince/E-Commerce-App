package ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce.models.Logins;
import ecommerce.models.User;

public interface LoginRepository extends JpaRepository<Logins,UUID>{

    List<Logins> findAllByUser(User user);
    
}
