package ecommerce.service;

import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
import ecommerce.models.History;
import ecommerce.models.User;
import ecommerce.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public void log(String action, UserRole role, ModelEnum model,User user){
        
        History history = new History();
        history.setAction(action);
        history.setModel(model);
        history.setRole(role);
        history.setUser(user);


        historyRepository.save(history);
    }
    
}
