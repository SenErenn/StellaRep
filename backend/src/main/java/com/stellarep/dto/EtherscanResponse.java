package com.stellarep.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class EtherscanResponse {
    private String status;
    private String message;
    private EtherscanResult result;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EtherscanResult {
        private String account;
        private String balance;
        
        @JsonProperty("firstTxTimestamp")
        private String firstTxTimestamp;
        
        @JsonProperty("txCount")
        private String txCount;
    }
}
