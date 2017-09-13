package com.accenture.oauth.controllers;

import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@Controller
public class HomeController {

    @GetMapping(value = "/")
    public String index(){
        return "Helloworld";
    }

    @GetMapping(value = "/private")
    public String privatere(){
        return "Hello private";
    }
    
    
    @GetMapping(value = "/login")
    public String login(){
        return "login";
    }
}
