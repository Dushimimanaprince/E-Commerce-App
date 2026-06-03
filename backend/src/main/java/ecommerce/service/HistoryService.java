package ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
import ecommerce.models.History;
import ecommerce.models.User;
import ecommerce.repository.HistoryRepository;
import ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;
    private final UserRepository userRepository;

    public void log(String action, UserRole role, ModelEnum model,User user){
        
        History history = new History();
        history.setAction(action);
        history.setModel(model);
        history.setRole(role);
        history.setUser(user);


        historyRepository.save(history);
    }

    public List<History> viewMyHistory(){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));

        return historyRepository.findAllByUser(user);
    }

    public List<History> viewAllHistory(){
        return historyRepository.findAll();
    }
    
}
