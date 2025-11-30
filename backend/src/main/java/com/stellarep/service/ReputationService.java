package com.stellarep.service;

import com.stellarep.dto.EthereumAccountData;
import com.stellarep.dto.ScoreResponse;
import com.stellarep.dto.StellarAccountData;
import com.stellarep.entity.WalletScore;
import com.stellarep.repository.WalletScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReputationService {

        private final StellarAnalysisService stellarAnalysisService;
        private final EtherscanService etherscanService;
        private final ScoreCalculationService scoreCalculationService;
        private final WalletScoreRepository walletScoreRepository;
        private final SorobanService sorobanService;

        @Transactional
        public ScoreResponse calculateAndStoreReputation(String stellarAddress, String ethereumAddress) {
                StellarAccountData stellarData = stellarAnalysisService.analyzeWallet(stellarAddress);

                EthereumAccountData ethereumData;
                if (ethereumAddress != null && !ethereumAddress.trim().isEmpty()) {
                        log.info("Analyzing Ethereum wallet: {}", ethereumAddress);
                        ethereumData = etherscanService.analyzeWallet(ethereumAddress);
                } else {
                        log.info("No Ethereum address provided, using empty data");
                        ethereumData = EthereumAccountData.empty();
                }

                var scoreComponents = scoreCalculationService.calculateScore(stellarData, ethereumData);

                WalletScore walletScore = walletScoreRepository.findByStellarAddress(stellarAddress)
                                .orElse(WalletScore.builder()
                                                .stellarAddress(stellarAddress)
                                                .build());

                walletScore.setEthereumAddress(ethereumAddress);
                walletScore.setScore(scoreComponents.getTotalScore());
                walletScore.setStellarScore(scoreComponents.getStellarScore());
                walletScore.setEthereumScore(scoreComponents.getEthereumScore());
                walletScore.setSocialScore(scoreComponents.getSocialScore());
                walletScore.setAccountAgeDays(stellarData.getAccountAgeDays());
                walletScore.setTransactionCount(stellarData.getTransactionCount());
                walletScore.setStellarBalance(stellarData.getBalance());
                walletScore.setHasEthereumHistory(ethereumData.isHasHistory());
                walletScore.setEthereumAgeDays(ethereumData.getAccountAgeDays());
                walletScore.setEthereumBalance(ethereumData.getBalance());

                walletScore = walletScoreRepository.save(walletScore);

                boolean onChain = false;
                if (sorobanService.isContractConfigured()) {
                        try {
                                sorobanService.setReputation(stellarAddress, scoreComponents.getTotalScore());
                                onChain = true;
                                log.info("Reputation stored on Soroban smart contract");
                        } catch (Exception e) {
                                log.warn("On-chain storage failed: {}", e.getMessage());
                                onChain = false;
                        }
                } else {
                        log.info("Soroban contract not configured, storing off-chain");
                }

                return ScoreResponse.builder()
                                .stellarAddress(stellarAddress)
                                .ethereumAddress(ethereumAddress)
                                .totalScore(scoreComponents.getTotalScore())
                                .stellarScore(scoreComponents.getStellarScore())
                                .ethereumScore(scoreComponents.getEthereumScore())
                                .socialScore(scoreComponents.getSocialScore())
                                .breakdown(ScoreResponse.ScoreBreakdown.builder()
                                                .accountAgeDays(stellarData.getAccountAgeDays())
                                                .transactionCount(stellarData.getTransactionCount())
                                                .stellarBalance(stellarData.getBalance())
                                                .hasEthereumHistory(ethereumData.isHasHistory())
                                                .ethereumAgeDays(ethereumData.getAccountAgeDays())
                                                .ethereumTransactionCount(ethereumData.getTransactionCount())
                                                .ethereumBalance(ethereumData.getBalance())
                                                .build())
                                .calculatedAt(walletScore.getCalculatedAt())
                                .onChain(onChain)
                                .build();
        }

        public ScoreResponse getReputation(String stellarAddress) {
                return walletScoreRepository.findByStellarAddress(stellarAddress)
                                .map(score -> ScoreResponse.builder()
                                                .stellarAddress(score.getStellarAddress())
                                                .ethereumAddress(score.getEthereumAddress())
                                                .totalScore(score.getScore())
                                                .stellarScore(score.getStellarScore())
                                                .ethereumScore(score.getEthereumScore())
                                                .socialScore(score.getSocialScore())
                                                .breakdown(ScoreResponse.ScoreBreakdown.builder()
                                                                .accountAgeDays(score.getAccountAgeDays())
                                                                .transactionCount(score.getTransactionCount())
                                                                .stellarBalance(score.getStellarBalance())
                                                                .hasEthereumHistory(score.getHasEthereumHistory())
                                                                .ethereumAgeDays(score.getEthereumAgeDays())
                                                                .ethereumTransactionCount(null)
                                                                .ethereumBalance(score.getEthereumBalance())
                                                                .build())
                                                .calculatedAt(score.getCalculatedAt())
                                                .onChain(false)
                                                .build())
                                .orElseThrow(() -> new RuntimeException(
                                                "Reputation not found for address: " + stellarAddress));
        }
}
