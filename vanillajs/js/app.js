import View from "./view.js";
import Model from "./model.js";

const players = [
  { id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
  { id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];
function init() {
  const view = new View();
  const model = new Model("live-t3-storage-key", players);

  // Listens for when current tab chages
  model.addEventListener("statechange", () => {
    view.render(model.game, model.stats);
  });

  // Listens for when a different tab changes
  window.addEventListener("storage", () => {
    view.render(model.game, model.stats);
  });

  // The first load of the document
  view.render(model.game, model.stats);

  view.bindGameResetEvent((event) => {
    model.reset();
  });

  view.bindNewRoundEvent((event) => {
    model.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = model.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }

    model.playerMove(+square.id);
  });
}

window.addEventListener("load", init);
