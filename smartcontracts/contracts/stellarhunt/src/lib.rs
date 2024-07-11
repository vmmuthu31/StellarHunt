#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, log, Env, String, Address, Vec};

#[contracttype]
#[derive(Clone)]
pub struct User {
    diamonds: u32,
    nfts: Vec<String>,
    xp: u32,
}

#[contract]
pub struct UserContract;

#[contractimpl]
impl UserContract {
    /// Initializes a new user with default values.
    pub fn initialize_user(env: Env, username: String, wallet: Address) {
        let user = User {
            diamonds: 0,
            nfts: Vec::new(&env),
            xp: 0,
        };
        
        // Store the user in the contract's storage using the wallet address as the key.
        env.storage().instance().set(&wallet, &user);
        
        // Log the initialization of the user.
        log!(&env, "Initialized user: {} with wallet: {}", username, wallet);
    }

    /// Updates the user's diamonds, NFTs, and XP.
    pub fn update_user(env: Env, wallet: Address, diamonds: u32, nfts: Vec<String>, xp: u32) {
        if let Some(mut user) = env.storage().instance().get::<Address, User>(&wallet) {
            user.diamonds += diamonds;
            for nft in nfts.iter() {
                user.nfts.push_back(nft.clone());
            }
            user.xp += xp;
            env.storage().instance().set(&wallet, &user);
            log!(&env, "Updated user with wallet: {}. Diamonds: {}, NFTs: {:?}, XP: {}", wallet, user.diamonds, user.nfts, user.xp);
        } else {
            log!(&env, "User with wallet: {} not found", wallet);
        }
    }

    /// Registers a new user with a username and wallet address.
    ///
    /// This function will log the registration details.
    pub fn register_user(env: Env, username: String, wallet: Address) {
        log!(&env, "Registered user: {} with wallet: {}", username, wallet);
        Self::initialize_user(env, username, wallet);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env, Address};

    #[test]
    fn test_initialize_and_update_user() {
        let env = Env::default();
        let wallet = Address::random(&env);
        let username = String::from("test_user");

        // Register and initialize user
        UserContract::register_user(env.clone(), username.clone(), wallet.clone());

        // Update user
        let new_nfts = Vec::from_array(&env, &[String::from("NFT1"), String::from("NFT2")]);
        UserContract::update_user(env.clone(), wallet.clone(), 100, new_nfts, 50);

        // Fetch updated user details
        let user: User = env.storage().get(&wallet).unwrap();
        assert_eq!(user.diamonds, 100);
        assert_eq!(user.nfts.len(), 2);
        assert_eq!(user.xp, 50);
    }
}
