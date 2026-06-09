package ecommerce.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;

import lombok.RequiredArgsConstructor;


@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

            .cors(cors-> cors.configurationSource(request-> {
                var opt= new CorsConfiguration();
                opt.setAllowedOrigins(List.of("http://localhost:5174","http://10.90.164.45:5173"));
                opt.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                opt.setAllowedHeaders(List.of("*"));
                opt.setAllowCredentials(true);

                return opt;
            }))

            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/user/**").hasAnyRole("CUSTOMER", "ADMIN")
                .requestMatchers("/api/history/**").hasRole("ADMIN")
                .requestMatchers("/api/logins/**").hasRole("ADMIN")
                .requestMatchers("/api/cart/**").hasAnyRole("CUSTOMER", "ADMIN")
                .requestMatchers("/api/payments/**").hasAnyRole("CUSTOMER", "ADMIN")
                .requestMatchers("/api/orders/**").hasAnyRole("CUSTOMER", "ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/products/**").hasAnyRole("ADMIN")

                .anyRequest().authenticated()
            );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
    
}
