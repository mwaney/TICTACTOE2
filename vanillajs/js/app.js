const App = {
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
    squares: document.querySelectorAll('[data-id="square"]'),
  },
  state: {
    moves: [],
  },
  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((val) => p1Moves.includes(val));
      const p2Wins = pattern.every((val) => p2Moves.includes(val));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });
    return {
      status: moves.length == 9 || winner !== null ? "complete" : "in-progress", // complete || in-progress
      winner: winner, // 1 || 2
    };
  },
  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("Reset the game");
    });

    App.$.newRoundBtn.addEventListener("click", (event) => {
      console.log("New Round");
    });

    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // check if there exists an X or O if so don't do anything
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };
        if (hasMove(+square.id)) return;

        // Determine which icon to place in the square
        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const icon = document.createElement("i");

        if (currentPlayer == 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
        }

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });
        console.log(App.state);

        square.replaceChildren(icon);
        // Check if  there is a winner or tie game
        const game = App.getGameStatus(App.state.moves);
        if (game.status == "complete") {
          if (game.winner) {
            alert(`Player ${game.winner} wins!`);
          } else {
            alert(`You Tied`);
          }
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
