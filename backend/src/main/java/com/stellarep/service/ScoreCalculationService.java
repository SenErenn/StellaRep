package com.stellarep.service;

import com.stellarep.dto.EthereumAccountData;
import com.stellarep.dto.StellarAccountData;
import org.springframework.stereotype.Service;

@Service
public class ScoreCalculationService {

    private static final int MAX_SCORE = 1000;

    public ScoreComponents calculateScore(
            StellarAccountData stellarData,
            EthereumAccountData ethereumData) {
        
        int stellarScore = calculateStellarScore(stellarData);
        int ethereumScore = calculateEthereumScore(ethereumData);
        int socialScore = calculateSocialScore(stellarData, ethereumData);
        
        int finalScore = Math.min(stellarScore + ethereumScore + socialScore, MAX_SCORE);
        
        return ScoreComponents.builder()
                .totalScore(finalScore)
                .stellarScore(stellarScore)
                .ethereumScore(ethereumScore)
                .socialScore(socialScore)
                .build();
    }

    private int calculateStellarScore(StellarAccountData data) {
        double ageScore = Math.min(data.getAccountAgeDays() * 2.0, 200.0);
        double transactionScore = Math.min(data.getTransactionCount() * 0.5, 100.0);
        double balanceScore = Math.min(data.getBalance() * 10.0, 150.0);
        double diversityScore = data.getAssetDiversity() * 25.0;
        
        return (int) (ageScore + transactionScore + balanceScore + diversityScore);
    }

    private int calculateEthereumScore(EthereumAccountData data) {
        if (!data.isHasHistory()) {
            return 0;
        }
        
        double ageScore = Math.min(data.getAccountAgeDays() * 5.0, 300.0);
        double balanceScore = Math.min(data.getBalance() * 2.0, 200.0);
        double transactionScore = Math.min(data.getTransactionCount() * 0.3, 100.0);
        
        int baseScore = (int) (ageScore + balanceScore + transactionScore);
        
        if (data.getAccountAgeDays() > 365) {
            baseScore += 200;
        } else if (data.getAccountAgeDays() > 180) {
            baseScore += 100;
        }
        
        return Math.min(baseScore, 400);
    }

    private int calculateSocialScore(StellarAccountData stellarData, EthereumAccountData ethereumData) {
        int score = 0;
        
        if (stellarData.getTransactionCount() > 50) {
            score += 50;
        }
        
        if (stellarData.getBalance() > 100) {
            score += 50;
        }
        
        if (ethereumData.isHasHistory() && ethereumData.getAccountAgeDays() > 365) {
            score += 100;
        }
        
        return Math.min(score, 200);
    }

    public static class ScoreComponents {
        private int totalScore;
        private int stellarScore;
        private int ethereumScore;
        private int socialScore;
        
        public static ScoreComponentsBuilder builder() {
            return new ScoreComponentsBuilder();
        }
        
        public int getTotalScore() { return totalScore; }
        public int getStellarScore() { return stellarScore; }
        public int getEthereumScore() { return ethereumScore; }
        public int getSocialScore() { return socialScore; }
        
        public static class ScoreComponentsBuilder {
            private int totalScore;
            private int stellarScore;
            private int ethereumScore;
            private int socialScore;
            
            public ScoreComponentsBuilder totalScore(int totalScore) {
                this.totalScore = totalScore;
                return this;
            }
            
            public ScoreComponentsBuilder stellarScore(int stellarScore) {
                this.stellarScore = stellarScore;
                return this;
            }
            
            public ScoreComponentsBuilder ethereumScore(int ethereumScore) {
                this.ethereumScore = ethereumScore;
                return this;
            }
            
            public ScoreComponentsBuilder socialScore(int socialScore) {
                this.socialScore = socialScore;
                return this;
            }
            
            public ScoreComponents build() {
                ScoreComponents components = new ScoreComponents();
                components.totalScore = this.totalScore;
                components.stellarScore = this.stellarScore;
                components.ethereumScore = this.ethereumScore;
                components.socialScore = this.socialScore;
                return components;
            }
        }
    }
}
