package ecommerce.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class MicrofinanceService {

    @Value("${microfinance.url}")
    private String baseUrl;

    @Value("${microfinance.api}")
    private String apiKey;

    private final RestTemplate restTemplate;

    private HttpHeaders headers(){
        HttpHeaders headers= new HttpHeaders();
        headers.set("X-Api-Key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public Boolean validateUser(String microfinceUsername){

        String url= baseUrl+"/transactions/service/ecommerce/validate-user/?username="+microfinceUsername;

        try{

            restTemplate.exchange(url,HttpMethod.GET,
                new HttpEntity<>(headers()),Map.class);
            
            return true;
        }catch(HttpClientErrorException e){
            return false;
        }
        
    }

    public String createFeeRequest(String microfinanceUsername, double amount, String user) {
        String url = baseUrl + "/transactions/service/ecommerce/create-fee-request/";

        String jsonBody = String.format(
            "{\"username\":\"%s\",\"amount\":\"%s\",\"user\":\"%s\"}",
            microfinanceUsername, String.valueOf(amount), user
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<Map> res = restTemplate.exchange(
            url, HttpMethod.POST, entity, Map.class
        );

        Object requestId = res.getBody().get("request_id");

        return requestId != null ? requestId.toString() : null;
        
    }


    public  String checkRequestStatus(UUID requestId){
        String url = baseUrl + "/transactions/service/ecommerce/request-status/" + requestId + "/";

        try{
            ResponseEntity<Map> res= restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers()), Map.class
            );
            return (String) res.getBody().get("status");
        }catch(Exception e){
            return null;
        }
    }
        
    
}
