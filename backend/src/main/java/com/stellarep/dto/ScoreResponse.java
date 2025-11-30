package com.stellarep.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreResponse {
    private String stellarAddress;
    private String ethereumAddress;
    private Integer totalScore;
    private Integer stellarScore;
    private Integer ethereumScore;
    private Integer socialScore;
    private ScoreBreakdown breakdown;
    private LocalDateTime calculatedAt;
    private Boolean onChain;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreBreakdown {
        private Long accountAgeDays;
        private Long transactionCount;
        private Double stellarBalance;
        private Boolean hasEthereumHistory;
        private Long ethereumAgeDays;
        private Long ethereumTransactionCount;
        private Double ethereumBalance;
    }
}
