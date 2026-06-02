package ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;

import org.springframework.stereotype.Service;

import ecommerce.Enum.PaymentStatusEnum;
import ecommerce.models.Payment;
import ecommerce.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentStatus {

    private final PaymentRepository paymentRepository;
    private final MicrofinanceService microfinanceService;


    @Scheduled(fixedDelay = 10000)
    public void pendingPayments(){

        List<Payment> pendingPayments= paymentRepository.findByStatus(PaymentStatusEnum.PENDING);

        for(Payment payment : pendingPayments){

            if(payment.getTransactionId() == null) continue;

            String status= microfinanceService.checkRequestStatus(UUID.fromString(payment.getTransactionId()));

            if (status == null) continue ;

            if( status.equalsIgnoreCase("paid")){
                payment.setStatus(PaymentStatusEnum.PAID);
                payment.setActive(false);
                paymentRepository.save(payment);
            }else if(status.equalsIgnoreCase("declined")){
                payment.setStatus(PaymentStatusEnum.DECLINED);
                payment.setActive(false);
                paymentRepository.save(payment);
            }

        }

    }

    
}
