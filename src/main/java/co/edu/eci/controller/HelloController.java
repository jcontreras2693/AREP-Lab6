package co.edu.eci.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "https://taller6arep.duckdns.org", allowedHeaders = "*", allowCredentials = "true")
public class HelloController {

    @GetMapping
    public String hello(){
        return "Hello World, From Spring Web";
    }
}
