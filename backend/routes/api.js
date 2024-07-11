const express = require("express");
const Game = require("../model/schema");
const router = express.Router();
const app = express();
app.use(express.json());

router.post("/addPlayer", async (req, res) => {
  try {
    const { gameId, userId, name } = req.body;
    let game = await Game.findOne({ gameId });
    if (game) {
      const playerIndex = game.players.findIndex(
        (player) => player.userId === userId
      );
      if (playerIndex > -1) {
        game.players[playerIndex].name = name;
      } else {
        game.players.push({ userId, name });
      }
    } else {
      game = new Game({ gameId, players: [{ userId, name }] });
    }
    await game.save();
    res.send("Player added to game");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/getGamePlayers/:gameId", async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findOne({ gameId });
  if (game) {
    res.json(game.players);
  } else {
    res.status(404).send("Game not found");
  }
});

module.exports = router;
