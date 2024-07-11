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
    username: String,
    diamonds: u32,
    xp: u32,
    matches: u32,
    kills: u32,
}

#[contracttype]
#[derive(Clone)]
pub struct LeaderboardEntry {
    user: User,
    nfts: Vec<NFT>,
}

#[contract]
pub struct UserContract;

#[contractimpl]
impl UserContract {
    fn is_username_taken(env: &Env, username: &String) -> bool {
        let leaderboard_key = String::from_str(env, "leaderboard");
        let leaderboard: Map<Address, LeaderboardEntry> = env.storage().instance().get(&leaderboard_key).unwrap_or(Map::new(env));

        for entry in leaderboard.iter() {
            let (_, leaderboard_entry) = entry;
            if leaderboard_entry.user.username == *username {
                return true;
            }
        }
        false
    }

    pub fn initialize_user(env: Env, username: String, wallet: Address) {
        let user = User {
            username: username.clone(),
            diamonds: 0,
            xp: 500,
            kills: 0,
            matches: 0,
        };

        env.storage().instance().set(&wallet, &user);

        let user_nfts_key = (wallet.clone(), String::from_str(&env, "nfts"));
        let empty_nfts: Vec<NFT> = Vec::new(&env);
        env.storage().instance().set(&user_nfts_key, &empty_nfts);

        let leaderboard_entry = LeaderboardEntry {
            user: user.clone(),
            nfts: empty_nfts.clone(),
        };
        let leaderboard_key = String::from_str(&env, "leaderboard");

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

            // Update user's NFTs.
            let user_nfts_key = (wallet.clone(), String::from_str(&env, "nfts"));
            let mut user_nfts: Vec<NFT> = env.storage().instance().get(&user_nfts_key).unwrap_or(Vec::new(&env));
            for nft in nfts.iter() {
                user_nfts.push_back(nft.clone());
            }
            env.storage().instance().set(&user_nfts_key, &user_nfts);

            // Update the leaderboard entry.
            let leaderboard_key = String::from_str(&env, "leaderboard");
            let mut leaderboard: Map<Address, LeaderboardEntry> = env.storage().instance().get(&leaderboard_key).unwrap_or(Map::new(&env));
            let leaderboard_entry = LeaderboardEntry {
                user: user.clone(),
                nfts: user_nfts.clone(),
            };
            leaderboard.set(wallet.clone(), leaderboard_entry);
            env.storage().instance().set(&leaderboard_key, &leaderboard);

            log!(&env, "Updated user with wallet: {}. Diamonds: {}, NFTs: {:?}, XP: {}", wallet, user.diamonds, user_nfts, user.xp);
        } else {
            log!(&env, "User with wallet: {} not found", wallet);
        }
    }

    
    pub fn register_user(env: Env, username: String, wallet: Address) {
        if Self::is_user_registered(env.clone(), wallet.clone()) {
            log!(&env, "Wallet address already registered: {}", wallet);
            return;
        }

        if Self::is_username_taken(&env, &username) {
            log!(&env, "Username already taken: {}", username);
            return;
        }

        log!(&env, "Registered user: {} with wallet: {}", username, wallet);

        Self::initialize_user(env, username, wallet);
    }

    pub fn get_user_nfts(env: Env, wallet: Address) -> Vec<NFT> {
        let user_nfts_key = (wallet, String::from_str(&env, "nfts"));
        env.storage().instance().get(&user_nfts_key).unwrap_or(Vec::new(&env))
    }

    pub fn get_leaderboard(env: Env) -> Map<Address, LeaderboardEntry> {
        let leaderboard_key = String::from_str(&env, "leaderboard");
        env.storage().instance().get(&leaderboard_key).unwrap_or(Map::new(&env))
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
        let username = String::from_str(&env, "test_user");

        UserContract::register_user(env.clone(), username.clone(), wallet.clone());

        let nft1 = NFT {
            image_url: String::from_str(&env, "https://example.com/nft1.png"),
            hash: String::from_str(&env, "hash1"),
            name: String::from_str(&env, "NFT 1"),
        };
        let nft2 = NFT {
            image_url: String::from_str(&env, "https://example.com/nft2.png"),
            hash: String::from_str(&env, "hash2"),
            name: String::from_str(&env, "NFT 2"),
        };
        let new_nfts = Vec::from_array(&env, &[nft1, nft2]);
        UserContract::update_user(env.clone(), wallet.clone(), 100, new_nfts, 50, 5);

        let user: User = env.storage().instance().get(&wallet).unwrap();
        assert_eq!(user.diamonds, 100);
        assert_eq!(user.xp, 550); 
        assert_eq!(user.kills, 5);
        assert_eq!(user.matches, 1);

        let user_nfts = UserContract::get_user_nfts(env.clone(), wallet.clone());
        assert_eq!(user_nfts.len(), 2);

        let leaderboard = UserContract::get_leaderboard(env.clone());
        let leaderboard_entry = leaderboard.get(wallet).unwrap();
        assert_eq!(leaderboard_entry.user.diamonds, 100);
        assert_eq!(leaderboard_entry.user.xp, 550);
        assert_eq!(leaderboard_entry.nfts.len(), 2);
    }
}
