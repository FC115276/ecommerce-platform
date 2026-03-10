package com.farmermarket.market.controller;

import com.farmermarket.market.entity.User;
import com.farmermarket.market.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class UserController {

private final UserService service;

public UserController(UserService service){
this.service = service;
}

@PostMapping("/register")
public User register(@RequestBody User user){
return service.register(user);
}

@PostMapping("/login")
public User login(@RequestBody User user){
return service.login(user.getUsername(),user.getPassword());
}

}
