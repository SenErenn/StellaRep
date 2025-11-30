package com.stellarep.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_scores")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 56)
    private String stellarAddress;
    
    private String ethereumAddress;
    
    @Column(nullable = false)
    private Integer score;
    
    private Integer stellarScore;
    private Integer ethereumScore;
    private Integer socialScore;
    
    private Long accountAgeDays;
    private Long transactionCount;
    private Double stellarBalance;
    
    private Boolean hasEthereumHistory;
    private Long ethereumAgeDays;
    private Double ethereumBalance;
    
    @Column(nullable = false)
    private LocalDateTime calculatedAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        calculatedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
