package ecommerce.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
import ecommerce.models.User;
import ecommerce.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final HistoryService historyService;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User viewUserDetails(UUID userId){
        
        return userRepository.findById(userId)
            .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));
        
    }


    public User getMyDetails(){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        return userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));
        
    }

    @Transactional
    public User editUser(String fullName,String phone,LocalDate dob){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));
        
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setDob(dob);

        User saved=userRepository.save(user);
        historyService.log("User Details Updated",UserRole.CUSTOMER,ModelEnum.USER,user);

        return saved;

    }


    @Transactional
    public User setUserActive(UUID userId){

        String loggedinId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
            
        User loggedinUser= userRepository.findById(UUID.fromString(loggedinId))
            .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));

        User user= userRepository.findById(userId)
            .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));

        user.setActive(!user.isActive());

        User saved=userRepository.save(user);

        historyService.log("User: "+user.getFullName()+" is Activated/Deactiveted",
            UserRole.ADMIN,ModelEnum.USER,loggedinUser);
        return saved;
    }

    public List<User> searchUsers(String userName){
        return userRepository.findByFullNameContainingIgnoreCase(userName);
    }

    
}
