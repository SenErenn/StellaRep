package com.stellarep.config;

import org.stellar.sdk.Network;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StellarConfig {

    @Value("${stellar.network:testnet}")
    private String network;

    @Bean
    public Network stellarNetwork() {
        if ("testnet".equals(network)) {
            return Network.TESTNET;
        }
        return Network.PUBLIC;
    }
}
