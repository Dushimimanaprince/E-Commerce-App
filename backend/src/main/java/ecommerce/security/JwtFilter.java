package ecommerce.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter{

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException,IOException{
        
        final String authheader= request.getHeader("Authorization");
        final String jwt;
        final String userId;

        if(authheader == null || !authheader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        jwt=authheader.substring(7);

        try{
            userId= jwtUtil.getUserId(jwt);

            if(userId != null && SecurityContextHolder.getContext()
                .getAuthentication()== null){
                    
                if(jwtUtil.isTokenValid(jwt)){
                    String role= jwtUtil.getRole(jwt);

                    SimpleGrantedAuthority authority= new SimpleGrantedAuthority("ROLE_"+role);

                    UsernamePasswordAuthenticationToken authToken= 
                        new UsernamePasswordAuthenticationToken(
                            userId,null,List.of(authority)
                        );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                }
                }
        }catch (Exception e){
            logger.error("Cannot set user authentication: "+ e.getMessage());
        }

        filterChain.doFilter(request, response);

        }
    
    
}
