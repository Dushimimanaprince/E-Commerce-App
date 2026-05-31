package ecommerce.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import ecommerce.models.Logins;
import ecommerce.repository.LoginRepository;
import ecommerce.repository.UserRepository;
import ecommerce.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginRepository loginRepository;


    public Map<String,String> login(String email,String password, HttpServletRequest request){
        Map<String,String> response= new HashMap<>();

        var user= userRepository.findByEmail(email)
            .orElseThrow(()-> new RuntimeException("Invalid Email"));

        if(!user.isActive()){
            throw new RuntimeException("The User is not Active");
        }

        if(!passwordEncoder.matches(password,user.getPassword())){
            throw new RuntimeException("Incorrect Password !");
        }

        String token = jwtUtil.generateToken(user.getUserId().toString(), user.getRole());
        response.put("token", token);
        response.put("email",user.getEmail());
        response.put("role", user.getRole().toString());

        Logins login= new Logins();
        login.setUser(user);
        login.setIpAddress(request.getRemoteAddr());
        login.setDeviceInfo(request.getHeader("User-Agent"));
        loginRepository.save(login);

        return response;

    }

    public List<Logins> getAllLogins(){
        return loginRepository.findAll();
    }
}
