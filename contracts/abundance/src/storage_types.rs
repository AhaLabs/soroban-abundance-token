use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype(export = false)]
pub struct AllowanceDataKey {
    pub from: Address,
    pub spender: Address,
}

#[derive(Clone)]
#[contracttype(export = false)]
pub enum DataKey {
    Allowance(AllowanceDataKey),
    Balance(Address),
    Nonce(Address),
    State(Address),
    Admin,
    Decimals,
    Name,
    Symbol,
}
