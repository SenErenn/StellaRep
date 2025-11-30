package com.stellarep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ScoreCalculationRequest {
    
    @NotBlank(message = "Stellar address is required")
    @Pattern(regexp = "^G[A-Z0-9]{55}$", message = "Invalid Stellar address format")
    private String stellarAddress;
    
    @Pattern(regexp = "^0x[a-fA-F0-9]{40}$", message = "Invalid Ethereum address format")
    private String ethereumAddress;
}
