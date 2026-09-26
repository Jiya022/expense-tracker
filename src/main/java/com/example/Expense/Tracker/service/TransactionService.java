package com.example.Expense.Tracker.service;

import com.example.Expense.Tracker.dto.TransactionRequest;
import com.example.Expense.Tracker.dto.TransactionResponse;

import java.util.List;

public interface TransactionService {
    TransactionResponse addTransaction(TransactionRequest request, String username);
    List<TransactionResponse> getAllTransactions(String username);
    List<TransactionResponse> getTransactionsByCategory(String username, String category);
    void deleteTransaction(Long id, String username);
    TransactionResponse updateTransaction(Long id, String username, TransactionRequest request);
}