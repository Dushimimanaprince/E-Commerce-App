package ecommerce.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ecommerce.models.User;
import ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAlluUsers(){
        return userRepository.findAll();
    }

    public User getMyDetails(){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        return userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));
        
    }

    public User editUser(String fullName,String phone,LocalDate dob){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));
        
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setDob(dob);

        return userRepository.save(user);

    }

    
}
