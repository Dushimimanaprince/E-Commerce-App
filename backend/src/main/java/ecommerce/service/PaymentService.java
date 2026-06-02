package ecommerce.service;

import org.springframework.stereotype.Service;

import ecommerce.repository.OrderRepository;
import ecommerce.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final HistoryService historyService;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;


    public
    
}
