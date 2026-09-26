package com.example.Expense.Tracker.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    // no password field on purpose — never sent back to the client
}
