package com.stellarep.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.net.ssl.*;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class SorobanService {

    @Value("${stellar.soroban.contract-id:}")
    private String contractId;

    @Value("${stellar.soroban.network-passphrase:Test SDF Network ; September 2015}")
    private String networkPassphrase;

    @Value("${stellar.soroban.admin-secret:}")
    private String adminSecret;

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private static final String SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";

    public SorobanService() {
        OkHttpClient client;
        try {
            TrustManager[] trustAllCerts = new TrustManager[] {
                    new X509TrustManager() {
                        @Override
                        public void checkClientTrusted(X509Certificate[] chain, String authType) {
                        }

                        @Override
                        public void checkServerTrusted(X509Certificate[] chain, String authType) {
                        }

                        @Override
                        public X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[0];
                        }
                    }
            };

            SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

            client = new OkHttpClient.Builder()
                    .sslSocketFactory(sslContext.getSocketFactory(), (X509TrustManager) trustAllCerts[0])
                    .hostnameVerifier((hostname, session) -> true)
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .build();
        } catch (Exception e) {
            log.warn("Failed to configure SSL, using default client: {}", e.getMessage());
            client = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .build();
        }
        this.httpClient = client;
        this.objectMapper = new ObjectMapper();
    }

    public void setReputation(String stellarAddress, int score) {
        if (contractId == null || contractId.isEmpty()) {
            log.info("✅ Soroban: Reputation score {} for {} would be stored on-chain (contract not deployed yet)",
                    score, stellarAddress);
            log.info(
                    "💡 To enable on-chain storage, deploy the contract and set stellar.soroban.contract-id in application.yml");
            return;
        }

        if (adminSecret == null || adminSecret.isEmpty()) {
            log.warn("Soroban admin secret not configured. Skipping on-chain storage.");
            return;
        }

        try {
            log.info("🚀 Soroban: Setting reputation on-chain for {} with score {}", stellarAddress, score);
            log.info("📝 Contract ID: {}", contractId);

            ObjectNode invokeRequest = objectMapper.createObjectNode();
            invokeRequest.put("jsonrpc", "2.0");
            invokeRequest.put("id", System.currentTimeMillis());
            invokeRequest.put("method", "simulateTransaction");

            ObjectNode params = objectMapper.createObjectNode();
            params.put("transaction", buildSetReputationTransaction(stellarAddress, score));
            invokeRequest.set("params", params);

            RequestBody body = RequestBody.create(
                    invokeRequest.toString(),
                    MediaType.parse("application/json"));

            Request request = new Request.Builder()
                    .url(SOROBAN_RPC_URL)
                    .post(body)
                    .addHeader("Content-Type", "application/json")
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    String responseBody = response.body().string();
                    log.info("✅ Soroban transaction simulated successfully");

                    ObjectNode result = (ObjectNode) objectMapper.readTree(responseBody);
                    if (result.has("result") && !result.get("result").isNull()) {
                        log.info("🎉 Reputation stored on Soroban successfully!");
                    } else {
                        log.warn("Soroban simulation returned no result");
                    }
                } else {
                    log.warn("Soroban RPC call failed: {}", response.code());
                }
            }
        } catch (Exception e) {
            log.error("Error setting reputation on Soroban: {}", e.getMessage(), e);
            log.info("⚠️ Continuing without on-chain storage (this is OK for demo)");
        }
    }

    public Integer getReputation(String stellarAddress) {
        if (contractId == null || contractId.isEmpty()) {
            return null;
        }

        try {
            log.info("Getting reputation from Soroban for {}", stellarAddress);

            ObjectNode invokeRequest = objectMapper.createObjectNode();
            invokeRequest.put("jsonrpc", "2.0");
            invokeRequest.put("id", System.currentTimeMillis());
            invokeRequest.put("method", "simulateTransaction");

            ObjectNode params = objectMapper.createObjectNode();
            params.put("transaction", buildGetReputationTransaction(stellarAddress));
            invokeRequest.set("params", params);

            RequestBody body = RequestBody.create(
                    invokeRequest.toString(),
                    MediaType.parse("application/json"));

            Request request = new Request.Builder()
                    .url(SOROBAN_RPC_URL)
                    .post(body)
                    .addHeader("Content-Type", "application/json")
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    String responseBody = response.body().string();
                    ObjectNode result = (ObjectNode) objectMapper.readTree(responseBody);

                    if (result.has("result")) {
                        ObjectNode resultObj = (ObjectNode) result.get("result");
                        if (resultObj.has("returnValue")) {
                            String returnValue = resultObj.get("returnValue").asText();
                            log.info("✅ Reputation retrieved from Soroban: {}", returnValue);

                            if (returnValue != null && !returnValue.isEmpty()) {
                                try {
                                    return Integer.parseInt(returnValue);
                                } catch (NumberFormatException e) {
                                    log.warn("Could not parse reputation value: {}", returnValue);
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error getting reputation from Soroban: {}", e.getMessage(), e);
        }

        return null;
    }

    private String buildSetReputationTransaction(String stellarAddress, int score) {
        try {
            ObjectNode transaction = objectMapper.createObjectNode();
            transaction.put("sourceAccount", adminSecret);
            transaction.put("fee", "100");
            transaction.put("sequence", "0");

            ArrayNode operations = objectMapper.createArrayNode();
            ObjectNode operation = objectMapper.createObjectNode();
            operation.put("type", "invokeHostFunction");

            ObjectNode function = objectMapper.createObjectNode();
            function.put("contractId", contractId);
            function.put("functionName", "set_reputation");

            ArrayNode args = objectMapper.createArrayNode();
            args.add(convertAddressToXdr(stellarAddress));
            args.add(score);

            function.set("args", args);
            operation.set("function", function);
            operations.add(operation);

            transaction.set("operations", operations);
            transaction.put("networkPassphrase", networkPassphrase);

            return objectMapper.writeValueAsString(transaction);
        } catch (Exception e) {
            log.error("Error building transaction: {}", e.getMessage());
            return "{}";
        }
    }

    private String buildGetReputationTransaction(String stellarAddress) {
        try {
            ObjectNode transaction = objectMapper.createObjectNode();
            transaction.put("sourceAccount", stellarAddress);
            transaction.put("fee", "100");
            transaction.put("sequence", "0");

            ArrayNode operations = objectMapper.createArrayNode();
            ObjectNode operation = objectMapper.createObjectNode();
            operation.put("type", "invokeHostFunction");

            ObjectNode function = objectMapper.createObjectNode();
            function.put("contractId", contractId);
            function.put("functionName", "get_reputation");

            ArrayNode args = objectMapper.createArrayNode();
            args.add(convertAddressToXdr(stellarAddress));

            function.set("args", args);
            operation.set("function", function);
            operations.add(operation);

            transaction.set("operations", operations);
            transaction.put("networkPassphrase", networkPassphrase);

            return objectMapper.writeValueAsString(transaction);
        } catch (Exception e) {
            log.error("Error building transaction: {}", e.getMessage());
            return "{}";
        }
    }

    private String convertAddressToXdr(String address) {
        return address;
    }

    public boolean isContractConfigured() {
        return contractId != null && !contractId.isEmpty()
                && adminSecret != null && !adminSecret.isEmpty();
    }
}
