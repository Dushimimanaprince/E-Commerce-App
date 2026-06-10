package ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ecommerce.Enum.ModelEnum;
import ecommerce.Enum.OrderStatus;
import ecommerce.Enum.PaymentStatusEnum;
import ecommerce.Enum.UserRole;
import ecommerce.models.Orders;
import ecommerce.models.Payment;
import ecommerce.models.User;
import ecommerce.repository.OrderRepository;
import ecommerce.repository.PaymentRepository;
import ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final HistoryService historyService;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final MicrofinanceService microfinanceService;
    


    public Payment initiateFeePayment(String microfinanceUsername, UUID orderId){

            String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

            User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

            Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

            if(!order.getUser().getUserId().equals(user.getUserId())){
                throw new RuntimeException("You can only pay for your own orders");
            }

            if(paymentRepository.findByOrder(order).isPresent()){
                throw new RuntimeException("Payment already initiated for this order");
            }

            if(!microfinanceService.validateUser(microfinanceUsername)){
                throw new RuntimeException("Microfinance username not found");
            }

            String requestId = microfinanceService.createFeeRequest(
                microfinanceUsername,
                order.getTotalPrice(),
                user.getFullName()
            );

            if(requestId == null){
                throw new RuntimeException("Failed to create payment request");
            }

            order.setOrderStatus(OrderStatus.PURCHASED);
            Orders updatedOrder = orderRepository.save(order);

            Payment payment = new Payment();
            payment.setAmount(updatedOrder.getTotalPrice());
            payment.setOrder(updatedOrder); 
            payment.setUser(user);
            payment.setTransactionId(requestId);
            payment.setStatus(PaymentStatusEnum.PENDING);
            payment.setActive(true);

            Payment saved = paymentRepository.save(payment);

            historyService.log("User: " + updatedOrder.getUser().getFullName() + " Payment initiated: " + updatedOrder.getTotalPrice(),
                UserRole.CUSTOMER, ModelEnum.PAYMENT, user);

            return saved;
    }

    public List<Payment> getMyPayments(){

        String userId= (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        User user= userRepository.findById(UUID.fromString(userId))
            .orElseThrow(()-> new RuntimeException("The user not found"));

        return paymentRepository.findAllByUser(user);

    }

    public List<Payment> getUserPayments(UUID userId){

        User user= userRepository.findById(userId)
            .orElseThrow(()-> new RuntimeException("The user not found"));
        
        return paymentRepository.findAllByUser(user);

    }

    public List<Payment> getAllPayments(){
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByStatus(String status){
        return paymentRepository.findByStatusContainingIgnoreCase(status);
    }

    public Orders viewPaymentDetails(UUID paymentId){

        Payment payment= paymentRepository.findById(paymentId)
            .orElseThrow(()-> new RuntimeException("The Payment not Found"));
        
        return  orderRepository.findByPayment(payment)
            .orElseThrow(()-> new RuntimeException("The Order not Found"));

        
    }
    
}
