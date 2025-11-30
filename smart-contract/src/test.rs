#![cfg(test)]

use super::{ReputationData, StellaRepContract, StellaRepContractClient};
use soroban_sdk::{symbol_short, testutils::Address as _, Address, Env};

#[test]
fn test_set_and_get_reputation() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, StellaRepContract);
    let client = StellaRepContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.set_reputation(&admin, &user, &750);
    
    let score = client.get_reputation(&user);
    assert_eq!(score, 750);
}

#[test]
fn test_get_nonexistent_reputation() {
    let env = Env::default();
    
    let contract_id = env.register_contract(None, StellaRepContract);
    let client = StellaRepContractClient::new(&env, &contract_id);
    
    let user = Address::generate(&env);
    
    let score = client.get_reputation(&user);
    assert_eq!(score, 0);
}

#[test]
fn test_max_score_limit() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, StellaRepContract);
    let client = StellaRepContractClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let user = Address::generate(&env);
    
    client.set_reputation(&admin, &user, &2000);
    
    let score = client.get_reputation(&user);
    assert_eq!(score, 1000);
}
