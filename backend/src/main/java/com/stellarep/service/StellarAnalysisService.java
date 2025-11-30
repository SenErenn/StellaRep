package com.stellarep.service;

import com.stellarep.dto.StellarAccountData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.stellar.sdk.Server;
import org.stellar.sdk.responses.AccountResponse;
import org.stellar.sdk.responses.Page;
import org.stellar.sdk.responses.TransactionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class StellarAnalysisService {

    @Value("${stellar.horizon.testnet-url}")
    private String horizonUrl;

    public StellarAccountData analyzeWallet(String stellarAddress) {
        try {
            Server server = new Server(horizonUrl);
            AccountResponse account = server.accounts().account(stellarAddress);

            long accountAgeDays = calculateAccountAgeFromFirstTransaction(server, stellarAddress);
            long transactionCount = countTransactions(server, stellarAddress);
            double balance = getXlmBalance(account);
            int assetDiversity = calculateAssetDiversity(account);

            return StellarAccountData.builder()
                    .accountAgeDays(accountAgeDays)
                    .transactionCount(transactionCount)
                    .balance(balance)
                    .assetDiversity(assetDiversity)
                    .createdAt("")
                    .build();

        } catch (Exception e) {
            log.error("Error analyzing Stellar wallet: {}", stellarAddress, e);
            return StellarAccountData.empty();
        }
    }

    private long calculateAccountAgeFromFirstTransaction(Server server, String address) {
        try {
            log.debug("Calculating account age for: {}", address);

            Page<TransactionResponse> transactions = server.transactions()
                    .forAccount(address)
                    .limit(200)
                    .order(org.stellar.sdk.requests.RequestBuilder.Order.ASC)
                    .execute();

            if (transactions == null || transactions.getRecords().isEmpty()) {
                log.warn("No transactions found for account: {}", address);
                return 0;
            }

            TransactionResponse firstTx = transactions.getRecords().get(0);
            String createdAtStr = firstTx.getCreatedAt();

            log.debug("First transaction found: created_at={}, hash={}", createdAtStr, firstTx.getHash());

            if (createdAtStr == null || createdAtStr.isEmpty()) {
                log.warn("First transaction has no createdAt timestamp for account: {}", address);
                return 0;
            }

            Instant firstTxTime = Instant.parse(createdAtStr);
            Instant now = Instant.now();
            long secondsDiff = now.getEpochSecond() - firstTxTime.getEpochSecond();
            long days = Math.max(0, secondsDiff / 86400L);

            log.info("Account age calculated: {} days (first transaction: {}, hash: {})",
                    days, firstTxTime, firstTx.getHash());
            return days;

        } catch (Exception e) {
            log.error("Error calculating account age for {}: {}", address, e.getMessage(), e);
            return 0;
        }
    }

    private long countTransactions(Server server, String address) {
        try {
            Page<TransactionResponse> transactions = server.transactions()
                    .forAccount(address)
                    .limit(200)
                    .execute();

            if (transactions == null || transactions.getRecords() == null) {
                return 0;
            }

            long count = transactions.getRecords().size();

            if (count == 200) {
                log.info("Transaction count may be incomplete (200+ transactions found for {})", address);
            }

            log.debug("Transaction count for {}: {}", address, count);
            return count;
        } catch (Exception e) {
            log.warn("Error counting transactions for {}: {}", address, e.getMessage());
            return 0;
        }
    }

    private double getXlmBalance(AccountResponse account) {
        try {
            AccountResponse.Balance[] balances = account.getBalances();
            if (balances == null) {
                return 0.0;
            }
            return Arrays.stream(balances)
                    .filter(b -> "native".equals(b.getAssetType()))
                    .mapToDouble(b -> {
                        try {
                            return Double.parseDouble(b.getBalance());
                        } catch (Exception e) {
                            return 0.0;
                        }
                    })
                    .findFirst()
                    .orElse(0.0);
        } catch (Exception e) {
            return 0.0;
        }
    }

    private int calculateAssetDiversity(AccountResponse account) {
        try {
            AccountResponse.Balance[] balances = account.getBalances();
            if (balances == null) {
                return 0;
            }
            Set<String> assetTypes = new HashSet<>();
            for (AccountResponse.Balance balance : balances) {
                if (!"native".equals(balance.getAssetType())) {
                    if (balance.getAssetCode().isPresent()) {
                        assetTypes.add(balance.getAssetCode().get());
                    }
                }
            }
            return assetTypes.size();
        } catch (Exception e) {
            return 0;
        }
    }
}
