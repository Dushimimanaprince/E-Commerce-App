package ecommerce.service;

import java.time.LocalDate;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
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


    public User registerUser(String fullName,String email,String phone,
                                LocalDate dob,String password
    ){


        if (userRepository.existsByEmail(email)){
            throw new RuntimeException("The User Already exists with provide Email");
        }
        if(userRepository.existsByPhone(phone)){
            throw new RuntimeException("The user with Phone number Already Exists");
        }

        User user= new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setDob(dob);
        user.setActive(false);
        user.setRole(UserRole.CUSTOMER);

        User saved=userRepository.save(user);

        verificationService.generateAndSend(email, saved.getUserId(),ModelEnum.USER);

        historyService.log("User Registration",UserRole.CUSTOMER,ModelEnum.USER,saved);

        return saved;


    }

    public void verifyRegisteringUser(String email, String code){

        if (email==null || code==null){
            throw new RuntimeException("Please provide Email or Code");
        }

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Verification verification= verificationRepository.findByEntityIdAndModel(user.getUserId(),ModelEnum.USER)
            .orElseThrow(()-> new RuntimeException("There is no Code Assigned to This Email for Registration"));

        if(!verification.getCode().equals(code)){
            throw new RuntimeException("Invalid Code: Please Provide real OTP Code");
        }

        if(verification.isUsed()){
            throw new RuntimeException("The verification already used please request another");
        }
        if(verification.isExpired()){
            throw new RuntimeException("Request another verification cause it is already past it's duration time ");
        }

        verification.setUsed(true);
        user.setActive(true);

        userRepository.save(user);
        verificationRepository.save(verification);
        

    }
    
}
