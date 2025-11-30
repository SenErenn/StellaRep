package com.stellarep.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stellarep.dto.EthereumAccountData;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.Instant;

@Service
@Slf4j
public class EtherscanService {

    @Value("${etherscan.base-url}")
    private String baseUrl;

    @Value("${etherscan.api-key}")
    private String apiKey;

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;

    public EtherscanService() {
        this.httpClient = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public EthereumAccountData analyzeWallet(String ethereumAddress) {
        if (ethereumAddress == null || ethereumAddress.trim().isEmpty()) {
            log.warn("Ethereum address is null or empty");
            return EthereumAccountData.empty();
        }

        ethereumAddress = ethereumAddress.trim();
        
        if (!ethereumAddress.startsWith("0x") || ethereumAddress.length() != 42) {
            log.warn("Invalid Ethereum address format: {}", ethereumAddress);
            return EthereumAccountData.empty();
        }

        try {
            log.info("Fetching Ethereum data for address: {}", ethereumAddress);
            
            String balanceResponse = fetchBalance(ethereumAddress);
            String txCountResponse = fetchTransactionCount(ethereumAddress);
            String firstTxResponse = fetchFirstTransaction(ethereumAddress);

            log.debug("Balance response: {}", balanceResponse);
            log.debug("Tx count response: {}", txCountResponse);
            log.debug("First tx response length: {}", firstTxResponse != null ? firstTxResponse.length() : 0);

            BigInteger balanceWei = parseBalance(balanceResponse);
            long txCount = parseTransactionCount(txCountResponse);
            long firstTxTimestamp = parseFirstTransaction(firstTxResponse);
            long accountAgeDays = calculateAccountAge(firstTxTimestamp);

            double balanceEth = balanceWei.divide(new BigInteger("1000000000000000000")).doubleValue();

            log.info("Ethereum analysis - Balance: {} ETH, TxCount: {}, Age: {} days, HasHistory: {}", 
                    balanceEth, txCount, accountAgeDays, firstTxTimestamp > 0);

            return EthereumAccountData.builder()
                    .hasHistory(firstTxTimestamp > 0)
                    .accountAgeDays(accountAgeDays)
                    .balance(balanceEth)
                    .transactionCount(txCount)
                    .firstTxTimestamp(firstTxTimestamp)
                    .build();

        } catch (Exception e) {
            log.error("Error analyzing Ethereum wallet: {} - Error: {}", ethereumAddress, e.getMessage(), e);
            return EthereumAccountData.empty();
        }
    }

    private String fetchBalance(String address) throws Exception {
        String url = baseUrl + "?module=account&action=balance&address=" + address + "&tag=latest&apikey=" + apiKey;
        Request request = new Request.Builder().url(url).build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                return response.body().string();
            }
            throw new RuntimeException("Failed to fetch balance");
        }
    }

    private String fetchTransactionCount(String address) throws Exception {
        String url = baseUrl + "?module=proxy&action=eth_getTransactionCount&address=" + address + "&tag=latest&apikey="
                + apiKey;
        Request request = new Request.Builder().url(url).build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                return response.body().string();
            }
            throw new RuntimeException("Failed to fetch transaction count");
        }
    }

    private String fetchFirstTransaction(String address) throws Exception {
        String url = baseUrl + "?module=account&action=txlist&address=" + address
                + "&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=" + apiKey;
        Request request = new Request.Builder().url(url).build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                return response.body().string();
            }
            throw new RuntimeException("Failed to fetch first transaction");
        }
    }

    private BigInteger parseBalance(String jsonResponse) throws Exception {
        var responseType = objectMapper.getTypeFactory().constructMapType(
                java.util.Map.class, String.class, Object.class);
        java.util.Map<String, Object> response = objectMapper.readValue(jsonResponse, responseType);

        if ("1".equals(response.get("status")) && response.get("result") != null) {
            String balanceStr = response.get("result").toString();
            return new BigInteger(balanceStr);
        }
        return BigInteger.ZERO;
    }

    private long parseTransactionCount(String jsonResponse) throws Exception {
        var responseType = objectMapper.getTypeFactory().constructMapType(
                java.util.Map.class, String.class, Object.class);
        java.util.Map<String, Object> response = objectMapper.readValue(jsonResponse, responseType);

        if ("1".equals(response.get("status")) && response.get("result") != null) {
            String txCountHex = response.get("result").toString();
            if (txCountHex.startsWith("0x")) {
                return Long.parseLong(txCountHex.substring(2), 16);
            }
            return Long.parseLong(txCountHex);
        }
        return 0;
    }

    private long parseFirstTransaction(String jsonResponse) throws Exception {
        var responseType = objectMapper.getTypeFactory().constructMapType(
                java.util.Map.class, String.class, Object.class);
        java.util.Map<String, Object> response = objectMapper.readValue(jsonResponse, responseType);

        if ("1".equals(response.get("status")) && response.get("result") != null) {
            Object resultObj = response.get("result");
            if (resultObj instanceof java.util.List) {
                java.util.List<?> results = (java.util.List<?>) resultObj;
                if (!results.isEmpty() && results.get(0) instanceof java.util.Map) {
                    java.util.Map<String, Object> firstTx = (java.util.Map<String, Object>) results.get(0);
                    Object timestampObj = firstTx.get("timeStamp");
                    if (timestampObj != null) {
                        return Long.parseLong(timestampObj.toString());
                    }
                }
            }
        }
        return 0;
    }

    private long calculateAccountAge(long firstTxTimestamp) {
        if (firstTxTimestamp == 0)
            return 0;
        Instant firstTx = Instant.ofEpochSecond(firstTxTimestamp);
        Instant now = Instant.now();
        return (now.getEpochSecond() - firstTx.getEpochSecond()) / 86400;
    }
}
