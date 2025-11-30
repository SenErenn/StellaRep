package com.stellarep.controller;

import com.stellarep.dto.ScoreCalculationRequest;
import com.stellarep.dto.ScoreResponse;
import com.stellarep.service.ReputationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reputation")
@RequiredArgsConstructor
public class ReputationController {

    private final ReputationService reputationService;

    @PostMapping("/calculate")
    public ResponseEntity<ScoreResponse> calculateReputation(
            @Valid @RequestBody ScoreCalculationRequest request) {
        ScoreResponse response = reputationService.calculateAndStoreReputation(
                request.getStellarAddress(),
                request.getEthereumAddress()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{stellarAddress}")
    public ResponseEntity<ScoreResponse> getReputation(
            @PathVariable String stellarAddress) {
        ScoreResponse response = reputationService.getReputation(stellarAddress);
        return ResponseEntity.ok(response);
    }
}
