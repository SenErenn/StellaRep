#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, String};

#[contract]
pub struct StellaRepContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReputationData {
    pub score: u32,
    pub timestamp: u64,
}

#[contractimpl]
impl StellaRepContract {
    pub fn set_reputation(
        env: Env,
        admin: Address,
        user_address: Address,
        score: u32,
    ) {
        admin.require_auth();
        
        let reputation_key = String::from_str(&env, "reputation");
        let mut reputations: Map<Address, ReputationData> = env
            .storage()
            .instance()
            .get(&reputation_key)
            .unwrap_or(Map::new(&env));

        let reputation_data = ReputationData {
            score: score.min(1000),
            timestamp: env.ledger().timestamp(),
        };

        reputations.set(user_address.clone(), reputation_data.clone());
        env.storage().instance().set(&reputation_key, &reputations);
    }

    pub fn get_reputation(env: Env, user_address: Address) -> u32 {
        let reputation_key = String::from_str(&env, "reputation");
        
        if let Some(reputations) = env
            .storage()
            .instance()
            .get::<String, Map<Address, ReputationData>>(&reputation_key)
        {
            if let Some(data) = reputations.get(user_address) {
                return data.score;
            }
        }
        
        0
    }

    pub fn get_reputation_with_timestamp(
        env: Env,
        user_address: Address,
    ) -> Option<(u32, u64)> {
        let reputation_key = String::from_str(&env, "reputation");
        
        if let Some(reputations) = env
            .storage()
            .instance()
            .get::<String, Map<Address, ReputationData>>(&reputation_key)
        {
            if let Some(data) = reputations.get(user_address) {
                return Some((data.score, data.timestamp));
            }
        }
        
        None
    }
}

#[cfg(test)]
mod test;
