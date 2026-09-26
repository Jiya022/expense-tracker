package com.example.Expense.Tracker.controller;

import com.example.Expense.Tracker.dto.LoginRequest;
import com.example.Expense.Tracker.dto.RegisterRequest;
import com.example.Expense.Tracker.dto.UserResponse;
import com.example.Expense.Tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ExpTrack")
@CrossOrigin
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return userService.login(request.getUsername(), request.getPassword());
    }
}