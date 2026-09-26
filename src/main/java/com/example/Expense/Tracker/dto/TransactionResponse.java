package com.example.Expense.Tracker.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TransactionResponse {
    private Long id;
    private String text;
    private double amount;
    private LocalDate date;
    // no "user" field here — the frontend never needs the full owning user object
}