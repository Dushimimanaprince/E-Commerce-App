package ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 🎯 IMPORT THIS

import ecommerce.Enum.OrderStatus;
import ecommerce.Enum.PaymentStatusEnum;
import ecommerce.models.Orders;
import ecommerce.models.Payment;
import ecommerce.repository.OrderRepository;
import ecommerce.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentStatus {

    private final PaymentRepository paymentRepository;
    private final MicrofinanceService microfinanceService;
    private final OrderRepository orderRepository;

    @Scheduled(fixedDelay = 10000)
    @Transactional
    public void pendingPayments(){

        List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatusEnum.PENDING);

        for(Payment payment : pendingPayments){

            if(payment.getTransactionId() == null) continue;

            String status = microfinanceService.checkRequestStatus(UUID.fromString(payment.getTransactionId()));

            if (status == null) continue;

            Orders order = payment.getOrder(); 

            if(status.equalsIgnoreCase("paid")){
                payment.setStatus(PaymentStatusEnum.PAID);
                payment.setActive(false);
                
                if (order != null) {
                    order.setOrderStatus(OrderStatus.PAID);
                    orderRepository.save(order);
                }
                paymentRepository.save(payment);
                
            } else if(status.equalsIgnoreCase("declined")){
                payment.setStatus(PaymentStatusEnum.DECLINED);
                payment.setActive(false);
                
                if (order != null) {
                    order.setOrderStatus(OrderStatus.CANCELLED);
                    orderRepository.save(order);
                }
                paymentRepository.save(payment);
            }
        }
    }
}