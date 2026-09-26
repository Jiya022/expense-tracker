package com.example.Expense.Tracker.service;

import com.example.Expense.Tracker.dto.TransactionRequest;
import com.example.Expense.Tracker.dto.TransactionResponse;
import com.example.Expense.Tracker.model.Transaction;
import com.example.Expense.Tracker.model.User;
import com.example.Expense.Tracker.repository.TransactionRepository;
import com.example.Expense.Tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public TransactionResponse addTransaction(TransactionRequest request, String username) {
        if (request.getText() == null || request.getText().isBlank()) {
            throw new RuntimeException("Transaction description cannot be empty");
        }
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found with username: " + username);
        }

        Transaction transaction = new Transaction();
        transaction.setText(request.getText());
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate());
        transaction.setUser(user);

        Transaction saved = transactionRepository.save(transaction);
        return toResponse(saved);
    }

    @Override
    public List<TransactionResponse> getAllTransactions(String username) {
        return transactionRepository.findByUserUsername(username)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTransaction(Long id, String username) {
        Transaction transaction = transactionRepository.findByIdAndUserUsername(id, username);
        if (transaction != null) {
            transactionRepository.delete(transaction);
        } else {
            throw new RuntimeException("Transaction not found or does not belong to the user: " + username);
        }
    }

    @Override
    public TransactionResponse updateTransaction(Long id, String username, TransactionRequest request) {
        Transaction existing = transactionRepository.findByIdAndUserUsername(id, username);
        if (existing == null) {
            throw new RuntimeException("Transaction not found or does not belong to the user: " + username);
        }
        existing.setText(request.getText());
        existing.setAmount(request.getAmount());
        existing.setDate(request.getDate());
        Transaction updated = transactionRepository.save(existing);
        return toResponse(updated);
    }

    // Helper to convert entity -> response DTO
    private TransactionResponse toResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setText(transaction.getText());
        response.setAmount(transaction.getAmount());
        response.setDate(transaction.getDate());
        return response;
    }
}