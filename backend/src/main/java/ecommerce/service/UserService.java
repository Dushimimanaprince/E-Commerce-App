package ecommerce.service;

import java.util.List;

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
    
}
