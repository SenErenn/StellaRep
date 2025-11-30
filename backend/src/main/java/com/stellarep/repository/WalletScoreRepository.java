package com.stellarep.repository;

import com.stellarep.entity.WalletScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletScoreRepository extends JpaRepository<WalletScore, Long> {
    Optional<WalletScore> findByStellarAddress(String stellarAddress);
    boolean existsByStellarAddress(String stellarAddress);
}
