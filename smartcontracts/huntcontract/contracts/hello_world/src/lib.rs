#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, log, Env, String, Address, Vec, Map};

#[contracttype]
#[derive(Clone)]
pub struct NFT {
    image_url: String,
    hash: String,
    name: String,
}

#[contracttype]
#[derive(Clone)]
pub struct User {
    diamonds: u32,
    xp: u32,
    matches: u32,
    kills: u32,
    tokens: i128,
}

#[contracttype]
#[derive(Clone)]
pub struct LeaderboardEntry {
    user: User,
    nfts: Vec<NFT>,
}

#[contracttype]
#[derive(Clone)]
pub struct UserData {
    username: String,
    user: User,
    nfts: Vec<NFT>,
}

#[contract]
pub struct UserContract;

#[contractimpl]
impl UserContract {
    /// Initializes a new user with default values and adds them to the leaderboard.
    pub fn initialize_user(env: Env, username: String, wallet: Address) {
        let user = User {
            diamonds: 0,
            xp: 500,
            kills: 0,
            matches: 0,
            tokens: 200,
        };

        env.storage().instance().set(&wallet, &user);

        let username_key = (wallet.clone(), String::from_slice(&env, "username"));
        env.storage().instance().set(&username_key, &username);

        let user_nfts_key = (wallet.clone(), String::from_slice(&env, "nfts"));
        let empty_nfts: Vec<NFT> = Vec::new(&env);
        env.storage().instance().set(&user_nfts_key, &empty_nfts);

        let leaderboard_entry = LeaderboardEntry {
            user: user.clone(),
            nfts: empty_nfts.clone(),
        };
        let leaderboard_key = String::from_slice(&env, "leaderboard");

        let mut leaderboard: Map<Address, LeaderboardEntry> = env.storage().instance().get(&leaderboard_key).unwrap_or(Map::new(&env));
        leaderboard.set(wallet.clone(), leaderboard_entry);
        env.storage().instance().set(&leaderboard_key, &leaderboard);

        log!(&env, "Initialized user: {} with wallet: {}", username, wallet);
    }

    pub fn is_user_registered(env: Env, wallet: Address) -> bool {
        env.storage().instance().get::<Address, User>(&wallet).is_some()
    }

    pub fn update_user(env: Env, wallet: Address, diamonds: u32, nfts: Vec<NFT>, xp: u32, kills: u32) {
        if let Some(mut user) = env.storage().instance().get::<Address, User>(&wallet) {
            user.diamonds += diamonds;
            user.xp += xp;
            user.kills += kills;
            user.matches += 1;
            env.storage().instance().set(&wallet, &user);

            let user_nfts_key = (wallet.clone(), String::from_slice(&env, "nfts"));
            let mut user_nfts: Vec<NFT> = env.storage().instance().get(&user_nfts_key).unwrap_or(Vec::new(&env));
            for nft in nfts.iter() {
                user_nfts.push_back(nft.clone());
            }
            env.storage().instance().set(&user_nfts_key, &user_nfts);

            Self::update_leaderboard(env.clone(), wallet.clone());

            log!(&env, "Updated user with wallet: {}. Diamonds: {}, NFTs: {:?}, XP: {}", wallet, user.diamonds, user_nfts, user.xp);
        } else {
            log!(&env, "User with wallet: {} not found", wallet);
        }
    }

    pub fn register_user(env: Env, username: String, wallet: Address) {
        log!(&env, "Registered user: {} with wallet: {}", username, wallet);
        Self::initialize_user(env, username, wallet);
    }

    pub fn get_user_nfts(env: Env, wallet: Address) -> Vec<NFT> {
        let user_nfts_key = (wallet, String::from_slice(&env, "nfts"));
        env.storage().instance().get(&user_nfts_key).unwrap_or(Vec::new(&env))
    }

    pub fn get_leaderboard(env: Env) -> Map<Address, LeaderboardEntry> {
        let leaderboard_key = String::from_slice(&env, "leaderboard");
        env.storage().instance().get(&leaderboard_key).unwrap_or(Map::new(&env))
    }

    pub fn transfer_tokens(env: Env, from: Address, to: Address, amount: i128) {
        if let Some(mut sender) = env.storage().instance().get::<Address, User>(&from) {
            if sender.tokens < amount {
                log!(&env, "Insufficient tokens");
                return;
            }
            if let Some(mut receiver) = env.storage().instance().get::<Address, User>(&to) {
                sender.tokens -= amount;
                receiver.tokens += amount;
                env.storage().instance().set(&from, &sender);
                env.storage().instance().set(&to, &receiver);

                Self::update_leaderboard(env.clone(), from.clone());
                Self::update_leaderboard(env.clone(), to.clone());

                log!(&env, "Transferred {} tokens from {} to {}", amount, from, to);
            } else {
                log!(&env, "Receiver not found");
            }
        } else {
            log!(&env, "Sender not found");
        }
    }

    pub fn reward_tokens(env: Env, wallet: Address, amount: i128) {
        if let Some(mut user) = env.storage().instance().get::<Address, User>(&wallet) {
            user.tokens += amount;
            env.storage().instance().set(&wallet, &user);

            Self::update_leaderboard(env.clone(), wallet.clone());

            log!(&env, "Rewarded {} tokens to {}", amount, wallet);
        } else {
            log!(&env, "User not found");
        }
    }

    pub fn get_user_data(env: Env, wallet: Address) -> Option<UserData> {
        let username_key = (wallet.clone(), String::from_slice(&env, "username"));
        let user = env.storage().instance().get::<Address, User>(&wallet)?;
        let username = env.storage().instance().get::<(Address, String), String>(&username_key)?;
        let nfts = Self::get_user_nfts(env.clone(), wallet.clone());

        Some(UserData { username, user, nfts })
    }

    fn update_leaderboard(env: Env, wallet: Address) {
        if let Some(user) = env.storage().instance().get::<Address, User>(&wallet) {
            let user_nfts_key = (wallet.clone(), String::from_slice(&env, "nfts"));
            let user_nfts: Vec<NFT> = env.storage().instance().get(&user_nfts_key).unwrap_or(Vec::new(&env));

            let leaderboard_key = String::from_slice(&env, "leaderboard");
            let mut leaderboard: Map<Address, LeaderboardEntry> = env.storage().instance().get(&leaderboard_key).unwrap_or(Map::new(&env));

            let leaderboard_entry = LeaderboardEntry {
                user: user.clone(),
                nfts: user_nfts.clone(),
            };
            leaderboard.set(wallet.clone(), leaderboard_entry);
            env.storage().instance().set(&leaderboard_key, &leaderboard);

            log!(&env, "Updated leaderboard for wallet: {}", wallet);
        }
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
        let username = String::from_slice(&env, "test_user");

        UserContract::register_user(env.clone(), username.clone(), wallet.clone());

        let nft1 = NFT {
            image_url: String::from_slice(&env, "https://example.com/nft1.png"),
            hash: String::from_slice(&env, "hash1"),
            name: String::from_slice(&env, "NFT 1"),
        };
        let nft2 = NFT {
            image_url: String::from_slice(&env, "https://example.com/nft2.png"),
            hash: String::from_slice(&env, "hash2"),
            name: String::from_slice(&env, "NFT 2"),
        };
        let new_nfts = Vec::from_array(&env, &[nft1, nft2]);
        UserContract::update_user(env.clone(), wallet.clone(), 100, new_nfts, 50, 5);

        let user: User = env.storage().instance().get(&wallet).unwrap();
        assert_eq!(user.diamonds, 100);
        assert_eq!(user.xp, 550);
        assert_eq!(user.kills, 5);
        assert_eq!(user.matches, 1);
        assert_eq!(user.tokens, 200);

        let user_nfts = UserContract::get_user_nfts(env.clone(), wallet.clone());
        assert_eq!(user_nfts.len(), 2);

        let leaderboard = UserContract::get_leaderboard(env.clone());
        let leaderboard_entry = leaderboard.get(wallet).unwrap();
        assert_eq!(leaderboard_entry.user.diamonds, 100);
        assert_eq!(leaderboard_entry.user.xp, 550);
        assert_eq!(leaderboard_entry.nfts.len(), 2);
        assert_eq!(leaderboard_entry.user.tokens, 200);
    }

    #[test]
    fn test_token_transfer() {
        let env = Env::default();
        let wallet1 = Address::random(&env);
        let wallet2 = Address::random(&env);
        let username1 = String::from_slice(&env, "user1");
        let username2 = String::from_slice(&env, "user2");

        UserContract::register_user(env.clone(), username1.clone(), wallet1.clone());
        UserContract::register_user(env.clone(), username2.clone(), wallet2.clone());

        UserContract::transfer_tokens(env.clone(), wallet1.clone(), wallet2.clone(), 50);

        let user1: User = env.storage().instance().get(&wallet1).unwrap();
        let user2: User = env.storage().instance().get(&wallet2).unwrap();
        assert_eq!(user1.tokens, 150);
        assert_eq!(user2.tokens, 250);

        let leaderboard = UserContract::get_leaderboard(env.clone());
        let entry1 = leaderboard.get(wallet1).unwrap();
        let entry2 = leaderboard.get(wallet2).unwrap();
        assert_eq!(entry1.user.tokens, 150);
        assert_eq!(entry2.user.tokens, 250);
    }

    #[test]
    fn test_token_reward() {
        let env = Env::default();
        let wallet = Address::random(&env);
        let username = String::from_slice(&env, "reward_user");

        UserContract::register_user(env.clone(), username.clone(), wallet.clone());
        UserContract::reward_tokens(env.clone(), wallet.clone(), 100);

        let user: User = env.storage().instance().get(&wallet).unwrap();
        assert_eq!(user.tokens, 300);

        let leaderboard = UserContract::get_leaderboard(env.clone());
        let entry = leaderboard.get(wallet).unwrap();
        assert_eq!(entry.user.tokens, 300);
    }

    #[test]
    fn test_get_user_data() {
        let env = Env::default();
        let wallet = Address::random(&env);
        let username = String::from_slice(&env, "user_data_test");

        UserContract::register_user(env.clone(), username.clone(), wallet.clone());

        let user_data = UserContract::get_user_data(env.clone(), wallet.clone()).unwrap();
        assert_eq!(user_data.username, username);

        let user: User = env.storage().instance().get(&wallet).unwrap();
        assert_eq!(user_data.user, user);

        let nfts = UserContract::get_user_nfts(env.clone(), wallet.clone());
        assert_eq!(user_data.nfts, nfts);
    }
}
