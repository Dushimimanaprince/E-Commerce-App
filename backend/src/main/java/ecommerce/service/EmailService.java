package ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtp(String toEmail, String code){
        SimpleMailMessage message=  new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Verify Your Account E-BUY");
        message.setText(
            "Hello,\n\n" +
            "Your verification code is: " + code + "\n\n" +
            "Valid for 10 minutes.\n" +
            "If you didn't request this, ignore this email."
        );
        mailSender.send(message);
    }
    
}
