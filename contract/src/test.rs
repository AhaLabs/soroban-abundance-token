#![cfg(test)]
extern crate std;

use crate::{contract::Token, TokenClient};
use soroban_sdk::{testutils::Address as _, Address, Env, IntoVal, Symbol};

const DECIMALS: u32 = 7;

fn create_token(e: &Env, admin: &Address) -> TokenClient {
    let token = TokenClient::new(e, &e.register_contract(None, Token {}));
    token.initialize(admin, &DECIMALS, &"name".into_val(e), &"symbol".into_val(e));
    token
}

#[test]
fn test() {
    let e: Env = Default::default();

    let admin1 = Address::random(&e);
    let admin2 = Address::random(&e);
    let user1 = Address::random(&e);
    let user2 = Address::random(&e);
    let user3 = Address::random(&e);
    let token = create_token(&e, &admin1);

    token.mint(&admin1, &user1, &1000);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            admin1.clone(),
            token.contract_id.clone(),
            Symbol::short("mint"),
            (&admin1, &user1, 1000_i128).into_val(&e),
        )]
    );
    assert_eq!(token.balance(&user1), 1000);

    token.incr_allow(&user2, &user3, &500);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            user2.clone(),
            token.contract_id.clone(),
            Symbol::new(&e, "incr_allow"),
            (&user2, &user3, 500_i128).into_val(&e),
        )]
    );
    assert_eq!(token.allowance(&user2, &user3), 500);

    token.xfer(&user1, &user2, &600);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            user1.clone(),
            token.contract_id.clone(),
            Symbol::short("xfer"),
            (&user1, &user2, 600_i128).into_val(&e),
        )]
    );
    assert_eq!(token.balance(&user1), 400);
    assert_eq!(token.balance(&user2), 600);

    token.xfer_from(&user3, &user2, &user1, &400);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            user3.clone(),
            token.contract_id.clone(),
            Symbol::short("xfer_from"),
            (&user3, &user2, &user1, 400_i128).into_val(&e),
        )]
    );
    assert_eq!(token.balance(&user1), 800);
    assert_eq!(token.balance(&user2), 200);

    token.xfer(&user1, &user3, &300);
    assert_eq!(token.balance(&user1), 500);
    assert_eq!(token.balance(&user3), 300);

    token.set_admin(&admin1, &admin2);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            admin1.clone(),
            token.contract_id.clone(),
            Symbol::short("set_admin"),
            (&admin1, &admin2).into_val(&e),
        )]
    );

    token.set_auth(&admin2, &user2, &false);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            admin2.clone(),
            token.contract_id.clone(),
            Symbol::short("set_auth"),
            (&admin2, &user2, false).into_val(&e),
        )]
    );
    assert_eq!(token.authorized(&user2), false);

    token.set_auth(&admin2, &user3, &true);
    assert_eq!(token.authorized(&user3), true);

    token.clawback(&admin2, &user3, &100);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            admin2.clone(),
            token.contract_id.clone(),
            Symbol::short("clawback"),
            (&admin2, &user3, 100_i128).into_val(&e),
        )]
    );
    assert_eq!(token.balance(&user3), 200);

    // Increase by 400, with an existing 100 = 500
    token.incr_allow(&user2, &user3, &400);
    assert_eq!(token.allowance(&user2, &user3), 500);
    token.decr_allow(&user2, &user3, &501);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            user2.clone(),
            token.contract_id.clone(),
            Symbol::new(&e, "decr_allow"),
            (&user2, &user3, 501_i128).into_val(&e),
        )]
    );
    assert_eq!(token.allowance(&user2, &user3), 0);
}

#[test]
fn token_plz() {
    let e: Env = Default::default();

    let admin = Address::random(&e);
    let user = Address::random(&e);
    let token = create_token(&e, &admin);

    token.token_plz(&user);

    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            user.clone(),
            token.contract_id.clone(),
            Symbol::short("token_plz"),
            (&user,).into_val(&e),
        )]
    );
    assert_eq!(token.balance(&user), 1 * 10i128.pow(DECIMALS));
}

#[test]
fn test_burn() {
    let e: Env = Default::default();

    let admin = Address::random(&e);
    let user1 = Address::random(&e);
    let user2 = Address::random(&e);
    let token = create_token(&e, &admin);

    token.mint(&admin, &user1, &1000);
    assert_eq!(token.balance(&user1), 1000);

    token.incr_allow(&user1, &user2, &500);
    assert_eq!(token.allowance(&user1, &user2), 500);

    token.burn_from(&user2, &user1, &500);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            user2.clone(),
            token.contract_id.clone(),
            Symbol::short("burn_from"),
            (&user2, &user1, 500_i128).into_val(&e),
        )]
    );
    assert_eq!(token.allowance(&user1, &user2), 0);
    assert_eq!(token.balance(&user1), 500);
    assert_eq!(token.balance(&user2), 0);

    token.burn(&user1, &500);
    assert_eq!(
        e.recorded_top_authorizations(),
        std::vec![(
            user1.clone(),
            token.contract_id.clone(),
            Symbol::short("burn"),
            (&user1, 500_i128).into_val(&e),
        )]
    );
    assert_eq!(token.balance(&user1), 0);
    assert_eq!(token.balance(&user2), 0);
}

#[test]
#[should_panic(expected = "insufficient balance")]
fn xfer_insufficient_balance() {
    let e: Env = Default::default();
    let admin = Address::random(&e);
    let user1 = Address::random(&e);
    let user2 = Address::random(&e);
    let token = create_token(&e, &admin);

    token.mint(&admin, &user1, &1000);
    assert_eq!(token.balance(&user1), 1000);

    token.xfer(&user1, &user2, &1001);
}

#[test]
#[should_panic(expected = "can't receive when deauthorized")]
fn xfer_receive_deauthorized() {
    let e: Env = Default::default();
    let admin = Address::random(&e);
    let user1 = Address::random(&e);
    let user2 = Address::random(&e);
    let token = create_token(&e, &admin);

    token.mint(&admin, &user1, &1000);
    assert_eq!(token.balance(&user1), 1000);

    token.set_auth(&admin, &user2, &false);
    token.xfer(&user1, &user2, &1);
}

#[test]
#[should_panic(expected = "can't spend when deauthorized")]
fn xfer_spend_deauthorized() {
    let e: Env = Default::default();
    let admin = Address::random(&e);
    let user1 = Address::random(&e);
    let user2 = Address::random(&e);
    let token = create_token(&e, &admin);

    token.mint(&admin, &user1, &1000);
    assert_eq!(token.balance(&user1), 1000);

    token.set_auth(&admin, &user1, &false);
    token.xfer(&user1, &user2, &1);
}

#[test]
#[should_panic(expected = "insufficient allowance")]
fn xfer_from_insufficient_allowance() {
    let e: Env = Default::default();
    let admin = Address::random(&e);
    let user1 = Address::random(&e);
    let user2 = Address::random(&e);
    let user3 = Address::random(&e);
    let token = create_token(&e, &admin);

    token.mint(&admin, &user1, &1000);
    assert_eq!(token.balance(&user1), 1000);

    token.incr_allow(&user1, &user3, &100);
    assert_eq!(token.allowance(&user1, &user3), 100);

    token.xfer_from(&user3, &user1, &user2, &101);
}

#[test]
#[should_panic(expected = "already initialized")]
fn initialize_already_initialized() {
    let e: Env = Default::default();
    let admin = Address::random(&e);
    let token = create_token(&e, &admin);

    token.initialize(&admin, &10, &"name".into_val(&e), &"symbol".into_val(&e));
}

#[test]
#[should_panic(expected = "Decimal must fit in a u8")]
fn decimal_is_over_max() {
    let e = Default::default();
    let admin = Address::random(&e);
    let token = TokenClient::new(&e, &e.register_contract(None, Token {}));
    token.initialize(
        &admin,
        &(u32::from(u8::MAX) + 1),
        &"name".into_val(&e),
        &"symbol".into_val(&e),
    );
}
