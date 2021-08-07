'use strict';

(function () {
  //FUNCTION FACTORY to create Player Object
  const Player = (name, pawn) => {
    return { name, pawn };
  };

  //MODULE for providing anything related to board
  const GameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    const winCondition = () => {
      if (
        (board[0] === 'X' && board[1] === 'X' && board[2] === 'X') ||
        (board[3] === 'X' && board[4] === 'X' && board[5] === 'X') ||
        (board[6] === 'X' && board[7] === 'X' && board[8] === 'X') ||
        (board[0] === 'X' && board[3] === 'X' && board[6] === 'X') ||
        (board[1] === 'X' && board[4] === 'X' && board[7] === 'X') ||
        (board[2] === 'X' && board[5] === 'X' && board[8] === 'X') ||
        (board[0] === 'X' && board[4] === 'X' && board[8] === 'X') ||
        (board[2] === 'X' && board[4] === 'X' && board[6] === 'X')
      ) {
        DisplayController.message.textContent = 'X WIN (restart game?)';
      } else if (
        (board[0] === 'O' && board[1] === 'O' && board[2] === 'O') ||
        (board[3] === 'O' && board[4] === 'O' && board[5] === 'O') ||
        (board[6] === 'O' && board[7] === 'O' && board[8] === 'O') ||
        (board[0] === 'O' && board[3] === 'O' && board[6] === 'O') ||
        (board[1] === 'O' && board[4] === 'O' && board[7] === 'O') ||
        (board[2] === 'O' && board[5] === 'O' && board[8] === 'O') ||
        (board[0] === 'O' && board[4] === 'O' && board[8] === 'O') ||
        (board[2] === 'O' && board[4] === 'O' && board[6] === 'O')
      ) {
        DisplayController.message.textContent = 'O WIN (restart game?';
      }
    };
    return { board, winCondition };
  })();

  //MODULE for providing DOM elements to other modules / functions
  const DisplayController = (() => {
    const playerOneName = document.querySelector('#player1-name');
    const playerTwoName = document.querySelector('#player2-name');
    const btnStart = document.querySelector('#start-button');
    const btnRestart = document.querySelector('#restart-button');
    const message = document.querySelector('h2');
    const fields = document.querySelectorAll('.field');

    return {
      playerOneName,
      playerTwoName,
      btnStart,
      btnRestart,
      message,
      fields,
    };
  })();

  //MODULE for providing games logic
  const GameFlowController = (() => {
    let turn = 0;
    let player;
    //creating player object

    const playerOne = Player(`${DisplayController.playerOneName.value}`, 'X');
    const playerTwo = Player(`${DisplayController.playerTwoName.value}`, 'O');

    const checkName = () =>
      DisplayController.playerOneName.value &&
      DisplayController.playerTwoName.value
        ? true
        : false;

    const displayPlayerTurn = () => {
      switch (turn % 2) {
        case 0:
          DisplayController.message.textContent = `${playerOne.name}'s turn`;
          break;
        case 1:
          DisplayController.message.textContent = `${playerTwo.name}'s turn`;
      }
    };

    const placePawn = (field, player) => {
      switch (turn % 2) {
        case 0:
          player = playerOne;
          turn++;
          break;
        case 1:
          player = playerTwo;
          turn++;
          break;
      }
      field.target.textContent = player.pawn;
      console.log(field);
      GameBoard.board[parseInt(field.target.getAttribute('data-field'))] =
        player.pawn;
      displayPlayerTurn();
      GameBoard.winCondition();
      console.log(GameBoard.board);
    };

    const provideField = () => {
      DisplayController.fields.forEach((field) => {
        field.addEventListener('click', placePawn, { once: true });
      });
    };

    const startGame = () => {
      DisplayController.btnStart.addEventListener(
        'click',
        () => {
          displayPlayerTurn();
          provideField();
        },
        {
          once: true,
        }
      );
    };
    startGame();
  })();
})();
