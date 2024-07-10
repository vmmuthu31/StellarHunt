#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Address, Env, Symbol, Vec};

#[contract]

const INITIAL_HEALTH: u32 = 100;
const INITIAL_POINTS: u32 = 100;
const INITIAL_CRYSTALS: u32 = 0;
const INITIAL_WEAPONS: u32 = 1;

pub struct Player {
    pub health: u32,
    pub points: u32,
    pub crystals: u32,
    pub weapons: Vec<u32>,
    pub matches_played: u32,
}
pub struct StellarHunt;

#[contractimpl]
impl StellarHunt {
    pub fn initialize_player(env: Env, player_address: Address) {
        let player = Player {
            health: INITIAL_HEALTH,
            points: INITIAL_POINTS,
            crystals: INITIAL_CRYSTALS,
            weapons: vec![INITIAL_WEAPONS],
            matches_played: 0,
        };

        env.storage().set(&player_address, &player);
    }
}
