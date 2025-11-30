CREATE TABLE IF NOT EXISTS wallet_scores (
    id BIGSERIAL PRIMARY KEY,
    stellar_address VARCHAR(56) NOT NULL UNIQUE,
    ethereum_address VARCHAR(42),
    score INTEGER NOT NULL,
    stellar_score INTEGER,
    ethereum_score INTEGER,
    social_score INTEGER,
    account_age_days BIGINT,
    transaction_count BIGINT,
    stellar_balance DOUBLE PRECISION,
    has_ethereum_history BOOLEAN,
    ethereum_age_days BIGINT,
    ethereum_balance DOUBLE PRECISION,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stellar_address ON wallet_scores(stellar_address);
CREATE INDEX IF NOT EXISTS idx_ethereum_address ON wallet_scores(ethereum_address);
CREATE INDEX IF NOT EXISTS idx_score ON wallet_scores(score);
