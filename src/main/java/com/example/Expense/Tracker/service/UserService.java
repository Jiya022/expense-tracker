package com.example.Expense.Tracker.service;

import com.example.Expense.Tracker.dto.RegisterRequest;
import com.example.Expense.Tracker.dto.UserResponse;

public interface UserService {
    UserResponse registerUser(RegisterRequest request);
    UserResponse login(String username, String password);
}