package ecommerce.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce.Enum.ModelEnum;
import ecommerce.models.Verification;

public interface VerificationRepository extends JpaRepository<Verification,UUID> {


    Optional<Verification> findByCodeAndEntityId(String code, UUID entityId);
    List<Verification> findByEntityIdAndModel(UUID entityId, String model);
    Optional<Verification> findByEntityIdAndModel(UUID entityId, ModelEnum model);
}
