package ecommerce.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.UserRole;
import ecommerce.models.Cart;
import ecommerce.models.CartItem;
import ecommerce.models.Product;
import ecommerce.models.User;
import ecommerce.repository.CartItemsRepository;
import ecommerce.repository.CartRepository;
import ecommerce.repository.ProductRepository;
import ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemsRepository cartItemsRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final HistoryService historyService;
    


    public List<CartItem> getUserItems(){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        
        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));

        Cart cart= cartRepository.findByUser(user)
            .orElseGet(()->{
                Cart newCart= new Cart();
                newCart.setUser(user);
                return cartRepository.save(newCart);
            });
        
        return cartItemsRepository.findByCartAndIsActiveTrue(cart);
    }

    public CartItem addCartItem(UUID productId,int quantity){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        
        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));

        Cart cart= cartRepository.findByUser(user)
            .orElseGet(()->{
                Cart newCart= new Cart();
                newCart.setUser(user);
                return cartRepository.save(newCart);
            });
        
        Product product =  productRepository.findById(productId)
            .orElseThrow(()-> new RuntimeException("Product Not Found"));
        
        if(quantity > product.getQuantity()){
            throw new RuntimeException("Not enough stock for "+product.getProductName());
        }

        Optional<CartItem> existing = cartItemsRepository.findByCartAndProduct(cart, product);
        if(existing.isPresent()){
            throw new RuntimeException("Product already in cart, update quantity instead");
        }

        if(quantity<=0){
            throw new RuntimeException("The Quantity should be above 0");
        }
        
        CartItem cartItem= new CartItem();
        cartItem.setProduct(product);
        cartItem.setCart(cart);
        cartItem.setQuantity(quantity);
        cartItem.setActive(true);

        CartItem saved=cartItemsRepository.save(cartItem);
        historyService.log("User Added to Cart Product: "+product.getProductName(),
        UserRole.CUSTOMER,ModelEnum.CART,user
    
        );

        return saved;
        
    }
    public CartItem updateCartItem(UUID cartItemId,int quantity){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        
        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));

        CartItem cartItem = cartItemsRepository.findById(cartItemId)
            .orElseThrow(()-> new RuntimeException("The Items not Found"));
        
        if(quantity <= 0){
            throw new RuntimeException("The Quantity Should be Above 0");
        }
        if(quantity > cartItem.getProduct().getQuantity()){
            throw new RuntimeException("Not enough stock for "+cartItem.getProduct().getProductName());
        }
        cartItem.setQuantity(quantity);
        
        CartItem saved=cartItemsRepository.save(cartItem);

        historyService.log("The Cart Quantity updated to: "+quantity,UserRole.CUSTOMER, ModelEnum.CART, user);

        return saved;
    }

    public CartItem deleteCartItems(UUID cartItemId){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        
        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The User not Found"));

        CartItem cartItem= cartItemsRepository.findById(cartItemId)
            .orElseThrow(()-> new RuntimeException("The Item not Found"));
        
        cartItem.setActive(false);
        CartItem saved =cartItemsRepository.save(cartItem);

        historyService.log("Items in Cart Deleted",UserRole.CUSTOMER,ModelEnum.CART,user);

        return saved;
    }
    
}
