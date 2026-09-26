package com.example.Expense.Tracker.dto;

import lombok.Data;

@Data
public class TransactionSummaryResponse {
    private double balance;
    private double income;
    private double expense;
}