import View from "./view.js";
import Model from "./model.js";
// const App = {
//   $: {
//     menu: document.querySelector('[data-id="menu"]'),
//     menuItems: document.querySelector('[data-id="menu-items"]'),
//     resetBtn: document.querySelector('[data-id="reset-btn"]'),
//     newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
//     squares: document.querySelectorAll('[data-id="square"]'),
//     modal: document.querySelector('[data-id="modal"]'),
//     modalText: document.querySelector('[data-id="modal-text"]'),
//     modalBtn: document.querySelector('[data-id="modal-btn"]'),
//     turn: document.querySelector('[data-id="turn"]'),
//   },
//   state: {
//     moves: [],
//   },
//   getGameStatus(moves) {
//     const p1Moves = moves
//       .filter((move) => move.playerId === 1)
//       .map((move) => +move.squareId);
//     const p2Moves = moves
//       .filter((move) => move.playerId === 2)
//       .map((move) => +move.squareId);

//     const winningPatterns = [
//       [1, 2, 3],
//       [1, 5, 9],
//       [1, 4, 7],
//       [2, 5, 8],
//       [3, 5, 7],
//       [3, 6, 9],
//       [4, 5, 6],
//       [7, 8, 9],
//     ];

//     let winner = null;
//     winningPatterns.forEach((pattern) => {
//       const p1Wins = pattern.every((val) => p1Moves.includes(val));
//       const p2Wins = pattern.every((val) => p2Moves.includes(val));

//       if (p1Wins) winner = 1;
//       if (p2Wins) winner = 2;
//     });
//     return {
//       status: moves.length == 9 || winner !== null ? "complete" : "in-progress", // complete || in-progress
//       winner: winner, // 1 || 2
//     };
//   },
//   init() {
//     App.registerEventListeners();
//   },

//   registerEventListeners() {
//     App.$.menu.addEventListener("click", (event) => {
//       App.$.menuItems.classList.toggle("hidden");
//     });

//     App.$.resetBtn.addEventListener("click", (event) => {
//       console.log("Reset the game");
//     });

//     App.$.newRoundBtn.addEventListener("click", (event) => {
//       console.log("New Round");
//     });

//     App.$.modalBtn.addEventListener("click", () => {
//       App.state.moves = [];
//       App.$.squares.forEach((square) => square.replaceChildren());
//       App.$.modal.classList.add("hidden");
//     });

//     App.$.squares.forEach((square) => {
//       square.addEventListener("click", (event) => {
//         // check if there exists an X or O if so don't do anything
//         const hasMove = (squareId) => {
//           const existingMove = App.state.moves.find(
//             (move) => move.squareId === squareId
//           );
//           return existingMove !== undefined;
//         };
//         if (hasMove(+square.id)) return;

//         // Determine which icon to place in the square
//         const lastMove = App.state.moves.at(-1);
//         const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
//         const currentPlayer =
//           App.state.moves.length === 0
//             ? 1
//             : getOppositePlayer(lastMove.playerId);

//         const nextPlayer = getOppositePlayer(currentPlayer);

//         const icon = document.createElement("i");
//         const turnIcon = document.createElement("i");
//         const turnLabel = document.createElement("p");
//         turnLabel.textContent = `Player ${nextPlayer} You are Up!`;

//         if (currentPlayer == 1) {
//           icon.classList.add("fa-solid", "fa-x", "yellow");
//           turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
//           turnLabel.classList = "turquoise";
//         } else {
//           icon.classList.add("fa-solid", "fa-o", "turquoise");
//           turnIcon.classList.add("fa-solid", "fa-x", "yellow");
//           turnLabel.classList = "yellow";
//         }

//         App.$.turn.replaceChildren(turnIcon, turnLabel);

//         App.state.moves.push({
//           squareId: +square.id,
//           playerId: currentPlayer,
//         });
//         console.log(App.state);

//         square.replaceChildren(icon);
//         // Check if  there is a winner or tie game
//         const game = App.getGameStatus(App.state.moves);
//         if (game.status == "complete") {
//           App.$.modal.classList.remove("hidden");

//           let message = "";
//           if (game.winner) {
//             message = `Player ${game.winner} wins`;
//             // App.$;
//           } else {
//             message = "Tie game";
//           }

//           App.$.modalText.textContent = message;
//         }
//       });
//     });
//   },
// };

// window.addEventListener("load", App.init);

const players = [
  { id: 1, name: "Player 1", iconClass: "fa-x", colorClass: "turquoise" },
  { id: 2, name: "Player 2", iconClass: "fa-o", colorClass: "yellow" },
];
function init() {
  const view = new View();
  const model = new Model(players);

  view.bindGameResetEvent((event) => {
    view.closeAll();

    model.reset();
    view.clearMoves();

    view.setTurnIndicator(model.game.currentPlayer);
  });

  view.bindNewRoundEvent((event) => {
    console.log("New Round Event");
    console.log(event);
  });
  view.bindPlayerMoveEvent((square) => {
    const existingMove = model.game.moves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }

    // Place an icon of the current player in a square
    view.handlePlayerMove(square, model.game.currentPlayer);

    // Advance to the next state by pushing a move to the moves array
    model.playerMove(+square.id);

    if (model.game.status.isComplete) {
      view.openModal(
        model.game.status.winner
          ? `${model.game.status.winner.name} Wins!`
          : "Tie"
      );
      return;
    }

    // set the next players turn indicator
    view.setTurnIndicator(model.game.currentPlayer);
  });
}

window.addEventListener("load", init);
