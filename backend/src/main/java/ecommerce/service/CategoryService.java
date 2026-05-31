package ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
import ecommerce.models.Category;
import ecommerce.models.User;
import ecommerce.repository.CategoryRepository;
import ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final HistoryService historyService;
    private final UserRepository userRepository;
    

    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

    public Category createCategory(String name,String description){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));

        Category category= new Category();
        category.setCategoryName(name);
        category.setDescription(description);
        
        Category saved= categoryRepository.save(category);
        historyService.log("Category Registered",UserRole.ADMIN,ModelEnum.CATEGORY,user);

        return saved;

    }
    
}
