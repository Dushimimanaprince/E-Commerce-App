package ecommerce.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce.models.History;
import ecommerce.models.User;

public interface HistoryRepository extends JpaRepository<History,UUID> {

    List<History> findAllByUser(User user);
    
}
