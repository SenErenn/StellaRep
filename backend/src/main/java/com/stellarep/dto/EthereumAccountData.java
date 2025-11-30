package com.stellarep.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EthereumAccountData {
    private boolean hasHistory;
    private long accountAgeDays;
    private double balance;
    private long transactionCount;
    private long firstTxTimestamp;
    
    public static EthereumAccountData empty() {
        return EthereumAccountData.builder()
                .hasHistory(false)
                .accountAgeDays(0)
                .balance(0.0)
                .transactionCount(0)
                .firstTxTimestamp(0)
                .build();
    }
}
