package ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.OrderStatus;
import ecommerce.Enum.UserRole;
import ecommerce.models.Cart;
import ecommerce.models.CartItem;
import ecommerce.models.OrderItem;
import ecommerce.models.Orders;
import ecommerce.models.Product;
import ecommerce.models.User;
import ecommerce.repository.CartItemsRepository;
import ecommerce.repository.CartRepository;
import ecommerce.repository.OrderItemRepository;
import ecommerce.repository.OrderRepository;
import ecommerce.repository.ProductRepository;
import ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final HistoryService historyService;
    private final CartRepository cartRepository;
    private final CartItemsRepository cartItemsRepository;

    public List<Orders> viewAllOrders(){
        String userId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findAllByUser(user);
    }


    public List<OrderItem> viewOrderDetails(UUID orderId){
        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        return orderItemRepository.findAllByOrders(order);
    }

   public Orders createOrder(UUID productId, int quantity){
        String userId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        if(!product.isActive()){
            throw new RuntimeException("Product is no longer available");
        }
        if(quantity <= 0){
            throw new RuntimeException("Quantity should be above 0");
        }
        if(quantity > product.getQuantity()){
            throw new RuntimeException("Not enough stock");
        }

        double totalPrice = quantity * product.getPrice();

        Orders order = new Orders();
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setActive(true);
        order.setTotalPrice(totalPrice);
        Orders savedOrder = orderRepository.save(order);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrders(savedOrder);
        orderItem.setProduct(product);
        orderItem.setPrice(product.getPrice());
        orderItem.setQuantity(quantity);
        orderItemRepository.save(orderItem);

        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);

        historyService.log("User: "+user+" Placed Order Product: " + product.getProductName(),
            UserRole.CUSTOMER, ModelEnum.ORDERS, user);

        return savedOrder;
    }

    public Orders createOrderFromCart(){
        String userId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemsRepository.findByCartAndIsActiveTrue(cart);

        if(cartItems.isEmpty()){
            throw new RuntimeException("Cart is empty");
        }


        for(CartItem cartItem : cartItems){
            Product product = cartItem.getProduct();

            if(!product.isActive()){
                throw new RuntimeException("Product " + product.getProductName() + " is no longer available");
            }
            if(cartItem.getQuantity() > product.getQuantity()){
                throw new RuntimeException("Not enough stock for " + product.getProductName());
            }
        }


        double totalPrice = cartItems.stream()
            .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
            .sum();

        Orders order = new Orders();
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setActive(true);
        order.setTotalPrice(totalPrice);
        Orders savedOrder = orderRepository.save(order);



        for(CartItem cartItem : cartItems){
            Product product = cartItem.getProduct();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrders(savedOrder);
            orderItem.setProduct(product);
            orderItem.setPrice(product.getPrice()); 
            orderItem.setQuantity(cartItem.getQuantity());
            orderItemRepository.save(orderItem);


            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            cartItem.setActive(false);
            cartItemsRepository.save(cartItem);
        }

        historyService.log("Order placed from cart", UserRole.CUSTOMER, ModelEnum.ORDERS, user);

        return savedOrder;
    }


    public Orders editOrders(UUID orderId, UUID productId, int quantity){
        String userId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow(() -> new RuntimeException("User not found"));

        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        if(!order.getUser().getUserId().equals(UUID.fromString(userId))){
            throw new RuntimeException("You can only edit your own orders");
        }

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));



        OrderItem orderItem = orderItemRepository.findByOrdersAndProduct(order, product)
            .orElseThrow(() -> new RuntimeException("Order item not found"));

        if(quantity <= 0){
            throw new RuntimeException("Quantity should be above 0");
        }
        if(quantity > product.getQuantity()){
            throw new RuntimeException("Not enough stock");
        }

        double totalPrice = orderItemRepository.findAllByOrders(order)
            .stream()
            .mapToDouble(item -> {
                if(item.getProduct().getProductId().equals(productId)){
                    return item.getPrice() * quantity; 
                }
                return item.getPrice() * item.getQuantity(); 
            })
            .sum();

        order.setTotalPrice(totalPrice);
        orderRepository.save(order);

        orderItem.setQuantity(quantity);
        orderItemRepository.save(orderItem);

        historyService.log("Order updated: " + product.getProductName()
            + " quantity: " + quantity, UserRole.CUSTOMER, ModelEnum.ORDERS, user);

        return order;
    }
    public Orders deleteOrders(UUID orderId){
        String userId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        if(!order.getUser().getUserId().equals(UUID.fromString(userId))){
            throw new RuntimeException("You can only cancel your own orders");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setActive(false);

        return orderRepository.save(order);
    }

    public List<Orders> getAllOrders(){
        return orderRepository.findAll();
    }

    public Orders updateOrderStatus(UUID orderId, OrderStatus status){
        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(status);
        return orderRepository.save(order);
    }

    public List<Orders> getOrdersByStatus(OrderStatus status){
        return orderRepository.findByOrderStatus(status);
    }

    public List<Orders> getOrdersByUserId(UUID userId){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findAllByUser(user);
    }
}