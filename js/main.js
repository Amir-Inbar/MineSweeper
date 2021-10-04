'use strict';

var gLevel = {
  size: 4,
  mines: 2,
};
var gGame = {
  isOn: true,
  shownCount: 0,
  mineCount: gLevel.mines,
  markCount: 0,
};
var gBestScore1 = 16;
var gBestScore2 = 64;
var gBestScore3 = 144;
// var gResultsMap = {
//   highScoreLvl1: gBestScore1,
//   highScoreLvl1: gBestScore2,
//   highScoreLvl1: gBestScore3,
// };
var gTimeLeft;
var gLossCounter = 0;
var gGameStats = false;
var gMinesLocation = [];
var gNumsLocation = [];
var gBoard = null;
const FLAG = '🚩';
const MINE = '💣';
const EMPTY = '';
var isFlag = false;
var gIslight = false;
var gClickCount = 0;
var gElapsedTime = 0;
var timerInterval;
var backGroundSound = new Audio('/assets/img/background-audio.mp3');
var mineSound = new Audio('/assets/img/mine-sound.wav');

function init() {
  // backGroundSound.play();
  var gBoard = createBoardGame((gLevel.size = 4));
  getCreateTable(gBoard);
  if (timerInterval) clearInterval(timerInterval);
  getPlayerBestScore(gLevel);
  document.querySelector('.lives-count').innerHTML = '❤️❤️❤️';
}

function resetGame() {
  gGameStats = false;
  gIslight = false;
  clearInterval(timerInterval);
  backGroundSound.currentTime = 0;
  gIsFirstCellClick = false;
  // localStorage.clear();
  resetStopper();
  gNumsLocation = [];
  gBoard = null;
  gLossCounter = 0;
  init();
}

function showAllNums() {
  for (let i = 0; i < gNumsLocation.length; i++) {
    var numLocation = gNumsLocation[i];
    var cellI = numLocation.i;
    var cellj = numLocation.j;

    var elCell = document.querySelector(
      `[data-i="${cellI}"][data-j="${cellj}"]`
    );
    if (numLocation.minesAroundCount === 0) continue;
    elCell.innerHTML = numLocation.minesAroundCount;
    elCell.style.opacity = 1;
    numLocation.isShown = true;
  }
}

function showAllMines() {
  console.log(gMinesLocation);
  for (var i = 0; i < gMinesLocation.length; i++) {
    var mineLocation = gMinesLocation[i];
    var cellI = mineLocation.i;
    var cellj = mineLocation.j;

    var elCell = document.querySelector(
      `[data-i="${cellI}"][data-j="${cellj}"]`
    );
    if (mineLocation.isMine) {
      elCell.innerHTML = MINE;
      elCell.style.opacity = 1;
      mineLocation.isShown = true;
      mineSound.play();
    }
  }
}
function checkGameOver(clickedCell, elCell) {
  // game ends when all mines are marked
  // and all the other cells are shown
  if (clickedCell.isShown && clickedCell.isMine) {
    // don't pause the clock until 3 lifes
    // show him that he click a bomb with sound
    // do a click transition with a bomb
    // if the counter reach to 3 he can't click anything

    if (gLossCounter === 3) {
      pauseStopper();
      showAllMines();
      console.log('GAME OVER!!!!');
      toggleEmoji(gGameStats);
      gGame.isOn = false;
      elCell.style.backgroundColor = 'red';
    }
    setTimeout(() => {
      clickedCell.isShown = false;
      if (gLossCounter <= 3) elCell.style.opacity = 0;
    }, 1000);
    gLossCounter++;
    if (gLossCounter === 1)
      document.querySelector('.lives-count').innerHTML = '❤️❤️';
    gGameStats = false;
    toggleEmoji(gGameStats);
    if (gLossCounter === 2)
      document.querySelector('.lives-count').innerHTML = '❤️';
    gGameStats = false;
    toggleEmoji(gGameStats);
    if (gLossCounter === 3)
      document.querySelector('.lives-count').innerHTML = '';
    gGameStats = false;
    toggleEmoji(gGameStats);
    return;
  }

  var markCount = 0;
  for (let i = 0; i < gBoard[0].length; i++) {
    var row = gBoard[i];
    for (let j = 0; j < row.length; j++) {
      var cell = row[j];
      if (cell.isShown) {
        continue;
      }
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

  console.log(gLevel);
  if (markCount === gLevel.mines) {
    console.log(gTimeLeft);
    pauseStopper();
    getPlayerBestScore(gLevel, true);
    showAllNums();
    gGameStats = true;
    toggleEmoji(gGameStats);
    console.log('you win!!!!');
    gGame.isOn = false;
  }
}

function setGameLevel(levelSize = 10) {
  // getPlayerBestScore(levelSize);
  gBoard = [];
  gLevel.size = levelSize;
  if (levelSize === 4) {
    gLevel.mines = 2;
  }
  if (levelSize === 8) {
    gLevel.mines = 12;
  }
  if (levelSize === 12) {
    gLevel.mines = 30;
  }
  if (timerInterval) {
    resetStopper();
    gTimer = false;
  }
  var gBoard = createBoardGame(levelSize);
  document.querySelector('.lives-count').innerHTML = '❤️❤️❤️';
  getCreateTable(gBoard);
  getPlayerBestScore(gLevel);
  gIsFirstCellClick = false;

  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      if (levelSize === 8) elCell.classList.add('med-table');
      if (levelSize === 12) elCell.classList.add('lrg-table');
    }
  }
}
// }

function toggleEmoji(status) {
  var elEmoji = document.querySelector('.emoji-mood');
  var elWin = '😎';
  var elLoss = '😫';
  var normal = '😁';
  if (!status) elEmoji.innerHTML = elLoss;
  setTimeout(() => {
    var elEmoji = document.querySelector('.emoji-mood');
    elEmoji.innerHTML = normal;
  }, 3000);
  if (status) elEmoji.innerHTML = elWin;
}
