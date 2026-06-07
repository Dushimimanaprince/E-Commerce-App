package ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ecommerce.models.User;

@Repository
public interface UserRepository extends JpaRepository<User,UUID>{

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

    Optional<User> findByIsActive(boolean active);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    List<User> findByUserNameContainingIgnoreCase(String userName);
}
