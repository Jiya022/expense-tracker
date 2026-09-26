package com.example.Expense.Tracker.controller;

import com.example.Expense.Tracker.dto.TransactionRequest;
import com.example.Expense.Tracker.dto.TransactionResponse;
import com.example.Expense.Tracker.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ExpTrack/transactions")
@CrossOrigin
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/{username}")
    public TransactionResponse addTransaction(@RequestBody TransactionRequest request, @PathVariable String username) {
        return transactionService.addTransaction(request, username);
    }

    @GetMapping("/{username}")
    public List<TransactionResponse> getAllTransactions(@PathVariable String username) {
        return transactionService.getAllTransactions(username);
    }

    @GetMapping("/{username}/category/{category}")
    public List<TransactionResponse> getTransactionsByCategory(@PathVariable String username, @PathVariable String category) {
        return transactionService.getTransactionsByCategory(username, category);
    }

    @DeleteMapping("/{username}/{id}")
    public void deleteTransaction(@PathVariable String username, @PathVariable Long id) {
        transactionService.deleteTransaction(id, username);
    }

    @PutMapping("/{username}/{id}")
    public TransactionResponse updateTransaction(@PathVariable String username, @PathVariable Long id,
                                                 @RequestBody TransactionRequest request) {
        return transactionService.updateTransaction(id, username, request);
    }
}