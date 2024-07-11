const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameId: String,
  players: [{ userId: String, name: String }],
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
