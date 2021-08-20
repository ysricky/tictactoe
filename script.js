'use strict';

const game = (() => {
  //FUNCTION FACTORY to create Player Object
  const Player = (name, marker) => {
    const getMarker = () => marker;
    const shoutTurn = () => `${name} turn...`;
    const shoutWin = () => `${name} won this match!`;
    return { getMarker, shoutTurn, shoutWin };
  };

  //MODULE for providing anything related to board
  const GameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];
    const winPattern = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return { board, winPattern };
  })();

  //MODULE for providing games logic
  const gameFlowController = (() => {
    let gameOn;
    let player1;
    let player2;
    let playerAI;
    let turn = 0;

    const createPlayers = (playerName, playerMarker) => {
      const player = Player(playerName, playerMarker);
      return player;
    };

    const checkWinner = () => {
      let winner;
      checkTie();
      for (let i = 0; i < GameBoard.board.length; i++) {
        if (GameBoard.board[i] === '') continue;
        for (let j = 0; j < GameBoard.winPattern.length; j++) {
          if (
            GameBoard.board[GameBoard.winPattern[j][0]] ===
              GameBoard.board[i] &&
            GameBoard.board[GameBoard.winPattern[j][1]] ===
              GameBoard.board[i] &&
            GameBoard.board[GameBoard.winPattern[j][2]] === GameBoard.board[i]
          ) {
            if (GameBoard.board[i] === 'X') {
              winner = player1;
            } else {
              player2 ? (winner = player2) : (winner = playerAI);
            }
            DisplayController.displayMessage(winner.shoutWin().toUpperCase());
            gameOn = false;
            break;
          }
        }
      }
    };

    const checkTie = () => {
      if (!GameBoard.board.includes('')) {
        DisplayController.displayMessage('GAME TIE');
        gameOn = false;
      }
    };

    const startGame = () => {
      if (DisplayController.checkInputs()) {
        if (DisplayController.playerTwoName.value === 'AI') {
          playerAI = createPlayers(DisplayController.playerTwoName.value, 'O');
        } else {
          player2 = createPlayers(DisplayController.playerTwoName.value, 'O');
        }
        player1 = createPlayers(DisplayController.playerOneName.value, 'X');
        DisplayController.disableInputs();
        DisplayController.displayMessage(player1.shoutTurn());
        gameOn = true;
      } else {
        DisplayController.displayMessage('Please enter player name');
      }
    };

    const checkAvailableField = () => {
      const availableField = GameBoard.board.reduce(function (
        acc,
        curr,
        index
      ) {
        if (curr === '') {
          acc.push(index);
        }
        return acc;
      },
      []);
      const randomField = () =>
        Math.floor(Math.random() * availableField.length);
      return availableField[randomField()];
    };

    const player1Turn = (field) => {
      field.target.textContent = player1.getMarker();
      GameBoard.board[Number(field.target.getAttribute('id'))] =
        player1.getMarker();
      player2
        ? DisplayController.displayMessage(player2.shoutTurn())
        : DisplayController.displayMessage(playerAI.shoutTurn());
      checkWinner();
      turn++;
    };

    const player2Turn = (field) => {
      field.target.textContent = player2.getMarker();
      GameBoard.board[Number(field.target.getAttribute('id'))] =
        player2.getMarker();
      DisplayController.displayMessage(player1.shoutTurn());
      checkWinner();
      turn++;
    };

    const playerAITurn = () => {
      if (playerAI && gameOn) {
        const aiChoice = checkAvailableField();
        DisplayController.fields[aiChoice].textContent = playerAI.getMarker();
        GameBoard.board[aiChoice] = playerAI.getMarker();
        DisplayController.displayMessage(player1.shoutTurn());
        checkWinner();
        turn--;
      } else {
        return;
      }
    };

    const placeMarkerOnTurn = (field) => {
      if (turn % 2 === 0) {
        player1Turn(field);
        playerAITurn();
      } else {
        player2Turn(field);
      }
    };

    const setMarker = (field) => {
      if (gameOn && field.target.textContent === '') placeMarkerOnTurn(field);
    };

    const resetGameFlow = () => {
      turn = 0;
      gameOn = false;
      player1 = undefined;
      player2 = undefined;
      playerAI = undefined;
      GameBoard.board = ['', '', '', '', '', '', '', '', ''];
    };

    return { startGame, setMarker, resetGameFlow };
  })();

  //MODULE for providing DOM elements interactions
  const DisplayController = (() => {
    const playerOneName = document.querySelector('#player1-name');
    const playerTwoName = document.querySelector('#player2-name');
    const btnChooseOpponent = document.querySelector('#choose-opponent-button');
    const btnStart = document.querySelector('#start-button');
    const btnRestart = document.querySelector('#restart-button');
    const message = document.querySelector('h2');
    const fields = document.querySelectorAll('.field');

    const checkInputs = () => {
      return playerOneName.value !== '' && playerTwoName.value !== ''
        ? true
        : false;
    };

    const chooseOpponent = () => {
      if (btnChooseOpponent.textContent === 'VS AI') {
        playerTwoName.setAttribute('disabled', 'disabled');
        playerTwoName.value = 'AI';
        btnChooseOpponent.textContent = 'VS PLAYER';
        displayMessage('Player VS AI Mode');
      } else {
        playerTwoName.removeAttribute('disabled', 'disabled');
        playerTwoName.value = '';
        playerTwoName.setAttribute('placeholder', 'Player 2');
        btnChooseOpponent.textContent = 'VS AI';
        displayMessage('Player VS Player Mode');
      }
    };

    const displayMessage = (text) => (message.textContent = text);

    const disableInputs = () => {
      btnStart.setAttribute('disabled', 'disabled');
      btnChooseOpponent.setAttribute('disabled', 'disabled');
      playerOneName.setAttribute('disabled', 'disabled');
      playerTwoName.setAttribute('disabled', 'disabled');
    };

    const resetInputs = () => {
      if (btnChooseOpponent.textContent === 'VS PLAYER')
        playerTwoName.value = 'AI';
      playerOneName.value = '';
      playerTwoName.value = '';
    };

    const restartGame = () => {
      gameFlowController.resetGameFlow();
      resetInputs();
      displayMessage('WELCOME TO TIC-TAC-TOE');
      playerOneName.removeAttribute('disabled');
      playerTwoName.removeAttribute('disabled');
      btnStart.removeAttribute('disabled');
      btnChooseOpponent.removeAttribute('disabled');
      btnChooseOpponent.textContent = 'VS AI';
      fields.forEach((field) => {
        field.textContent = '';
      });
    };

    // event listener
    btnStart.addEventListener('click', gameFlowController.startGame);
    btnRestart.addEventListener('click', restartGame);
    btnChooseOpponent.addEventListener('click', chooseOpponent);
    fields.forEach((field) => {
      field.addEventListener('click', gameFlowController.setMarker);
    });

    resetInputs();

    return {
      playerOneName,
      playerTwoName,
      fields,
      checkInputs,
      disableInputs,
      displayMessage,
    };
  })();
})();
