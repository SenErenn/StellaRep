package com.stellarep.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StellarAccountData {
    private long accountAgeDays;
    private long transactionCount;
    private double balance;
    private int assetDiversity;
    private String createdAt;

    public static StellarAccountData empty() {
        return StellarAccountData.builder()
                .accountAgeDays(0)
                .transactionCount(0)
                .balance(0.0)
                .assetDiversity(0)
                .build();
    }
}
