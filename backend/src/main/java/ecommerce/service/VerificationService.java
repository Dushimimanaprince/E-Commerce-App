package ecommerce.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.models.Verification;
import ecommerce.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final EmailService emailService;

    public void generateAndSend(String email, UUID entityId, ModelEnum model){

        String code= String.valueOf((int)(Math.random()*900000)+100000);

        Verification verification= new Verification();
        verification.setCode(code);
        verification.setUsed(false);
        verification.setModel(model);
        verification.setEntityId(entityId);
        verificationRepository.save(verification);

        emailService.sendOtp(email, code);
    }
    
}
