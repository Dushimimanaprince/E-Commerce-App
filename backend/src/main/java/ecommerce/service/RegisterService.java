package ecommerce.service;

import java.time.LocalDate;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
import ecommerce.Enum.VerificationEnum;
import ecommerce.Enum.VerificationStatus;
import ecommerce.models.User;
import ecommerce.models.Verification;
import ecommerce.repository.UserRepository;
import ecommerce.repository.VerificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final HistoryService historyService;
    private final VerificationService verificationService;
    private final VerificationRepository verificationRepository;

    public User registerUser(String fullName, String email, String phone, LocalDate dob, String password) {
        if (userRepository.existsByEmail(email)){
            throw new RuntimeException("The User Already exists with provide Email");
        }
        if(userRepository.existsByPhone(phone)){
            throw new RuntimeException("The user with Phone number Already Exists");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setDob(dob);
        user.setActive(false);
        user.setRole(UserRole.CUSTOMER);

        User saved = userRepository.save(user);

        verificationService.generateAndSend(email, saved.getUserId(), ModelEnum.USER, VerificationEnum.REGISTRATION, VerificationStatus.PENDING);
        historyService.log("User Registration", UserRole.CUSTOMER, ModelEnum.USER, saved);

        return saved;
    }

    public void verifyRegisteringUser(String email, String code){
        if (email == null || code == null){
            throw new RuntimeException("Please provide Email or Code");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Verification verification = verificationRepository.findByEntityIdAndAction(user.getUserId(), VerificationEnum.REGISTRATION)
            .orElseThrow(() -> new RuntimeException("There is no Code Assigned to This Email for Registration"));

        if(!verification.getCode().equals(code)){
            throw new RuntimeException("Invalid Code: Please Provide real OTP Code");
        }


        if(verification.getStatus() != VerificationStatus.PENDING){
            throw new RuntimeException("The verification code has already been used or completed.");
        }
        
        if(verification.isExpired()){
            throw new RuntimeException("Request another verification cause it is already past its duration time");
        }

        verification.setStatus(VerificationStatus.COMPLETED);
        user.setActive(true);

        userRepository.save(user);
        verificationRepository.save(verification);
    }

    public void sendVerification(String email){
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("The user with this Email Doesn't Exist"));

        verificationService.generateAndSend(email, user.getUserId(), ModelEnum.USER, VerificationEnum.CHANGEPASSWORD, VerificationStatus.PENDING);
    }

    public void verifyChangePasswordOtp(String email, String code){
        if (email == null || code == null){
            throw new RuntimeException("Please provide Email and Code");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Please use a valid Email!"));

        Verification verification = verificationRepository
            .findByEntityIdAndAction(user.getUserId(), VerificationEnum.CHANGEPASSWORD)
            .orElseThrow(() -> new RuntimeException("No code found"));

        if(!verification.getCode().equals(code)){
            throw new RuntimeException("Invalid code! Please enter a valid OTP code");
        }

        if(verification.getStatus() != VerificationStatus.PENDING){
            throw new RuntimeException("The verification code was used before!");
        }

        if(verification.isExpired()){
            throw new RuntimeException("The verification is expired! Request Another Code to Verify");
        }

        verification.setStatus(VerificationStatus.VERIFIED);
        verificationRepository.save(verification); 
    }

    @Transactional  
    public User changePassword(String email, String password){
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("The User Email not Found! Please try with Valid Email"));

        Verification verification = verificationRepository.findByEntityIdAndAction(
            user.getUserId(), VerificationEnum.CHANGEPASSWORD)
            .orElseThrow(() -> new RuntimeException("The verification for Change Password not Found"));
        
        if(!verification.getStatus().equals(VerificationStatus.VERIFIED)){
            throw new RuntimeException("Please verify the code first");
        }

        if(verification.isExpired()){
            throw new RuntimeException("The verification session has expired");
        }

        if(password.length() < 8){
            throw new RuntimeException("The Password Should be above 8 characters");
        }

        user.setPassword(passwordEncoder.encode(password));
        

        verification.setStatus(VerificationStatus.COMPLETED);
        verificationRepository.save(verification); 

        User saved = userRepository.save(user);
        historyService.log("User: " + user.getFullName() + " Changed Password",
            UserRole.CUSTOMER, ModelEnum.USER, user);

        return saved;
    }

    @Transactional
    public void resendCode(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("The User Not Found with Provided Email"));
        
        Verification oldVerification = verificationRepository
            .findByEntityIdAndAction(user.getUserId(), VerificationEnum.REGISTRATION)
            .orElseThrow(() -> new RuntimeException("No active registration process found for this email"));

        if (!oldVerification.isExpired()) {
            throw new RuntimeException("You can't request a new code yet. The current one is still active.");
        }

        if (oldVerification.getStatus() == VerificationStatus.COMPLETED) {
            throw new RuntimeException("This account is already verified and active.");
        }

        verificationService.generateAndSend(email, user.getUserId(), ModelEnum.USER, VerificationEnum.REGISTRATION, VerificationStatus.PENDING);
    }
}