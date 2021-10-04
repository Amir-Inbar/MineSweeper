'use strick';

var gBoard = null;
var gLevel = {
  size: 4,
  mines: 2,
};
var gGame = {
  isOn: false,
  showCount: 0,
  mineCount: gLevel.size,
  markCount: 0,
};

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
var gLossCounter = 0;
var gGameStats;

function init() {
  var gBoard = createBoardGame(gLevel.size);
  getCreateTable(gBoard);
  console.log(gBoard);
}

function resetGame() {
  gIsFirstCellClick = false;
  gBoard = null;
  init();
}

function GameStatus(clickedCell, elCell) {
  if (clickedCell.isShown && clickedCell.isMine) {
    if (globalThis === 3) {
      console.log('gameOver!!!');
      gGame.isOn = false;
      elCell.style.backgroundColor = 'red';
    }

    setInterval(() => {
      clickedCell.isShown = false;
      if (gLossCounter <= 3) elCell.style.opacity = 0;
    }, 1000);
    gLossCounter++;
    if (gLossCounter === 1) {
      document.querySelector('.lives-count').innerText = '❤️❤️';
      gGameStats = false;
    }
    if (gLossCounter === 2) {
      document.querySelector('.lives-count').innerText = '❤️';
      gGameStats = false;
    }
    if (gLossCounter === 3) {
      document.querySelector('.lives-count').innerText = '';
      gGameStats = false;
      return;
    }
  }
  var markCount = 0;
  for (let i = 0; i < gBoard[0].length; i++) {
    var row = gBoard[i];
    for (let j = 0; j < row.length; j++) {
      var cell = row[j];
      if (cell.isShown) continue;
      if (cell.isMarked && !cell.isMine) {
        console.log('falsy flags');
        return;
      }
      if (cell.isMine && cell.isMarked) {
        markCount++;
        continue;
      }
      if (!cell.isShown && !cell.isMine) {
        console.log('reveal more cells');
        return;
      }
    }
  }
  if (markCount === gLevel.mines) {
    gGameStats = true;
    console.log('you win!!');
    gGame.isOn = false;
  }
}
