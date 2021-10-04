'use strick';
var gIsFirstCellClick = false;
function getCreateTable(board) {
  var tableTarget = document.querySelector('.table-container');
  var tableStr = '';
  for (let i = 0; i < board[0].length; i++) {
    tableStr += `<tr class="row-prop">`;
    const row = board[i];
    for (let j = 0; j < row.length; j++) {
      tableStr += `<td data-i="${i}" data-j="${j}" class="cell-prop" oncontextmenu="onRightClick(this,event,${i},${j})" onclick="onLeftClick(this,event,${i},${j})">${row[j].minesAroundCount}</td>`;
    }
    tableStr += `</tr>`;
  }
  tableTarget.innerHTML = `<table class="main-table">` + tableStr + `</table>`;
  return document.querySelector('.main-table');
}

function onRightClick(elCell, ev, i, j) {
  ev.preventDefault();
  var cell = gBoard[i][j];
  if (!gIsFirstCellClick) {
    gGame.isOn = true;
    addMines(i, j);
    countNegsAround(gLevel.size);
    renderColor();
    gIsFirstCellClick = true;
  }
  renderFlag(elCell, cell);
  GameStatus(cell);
}

function renderFlag(elCell, cell) {
  if (cell.isShown) return;
  if (!cell.isMarked) {
    elCell.style.opacity = 1;
    elCell.classList.remove('cell-prop');
    elCell.classList.add('curr-flag');
    elCell.innerHTML = `<span>${FLAG}</span>`;
  }
  if (cell.isMarked) {
    elCell.classList.remove('curr-flag');
    elCell.classList.add('cell-prop');
    elCell.style.opacity = 0;

    elCell.innerHTML = cell.minesAroundCount;
  }
  cell.isMarked = !cell.isMarked;
}

function onLeftClick(elCell, ev, i, j) {
  var cell = gBoard[i][j];

  if (!gIsFirstCellClick) {
    gGame.isOn = true;
    addMines(i, j);
    countNegsAround(gLevel.size);
    renderColor();
    gIsFirstCellClick = true;
  }
  showCell(elCell, cell);
  GameStatus(cell, elCell);
}

function renderColor() {
  for (var i = 0; i < gBoard.length; i++) {
    var row = gBoard[i];
    for (let j = 0; j < row; j++) {
      var cell = row[j];
      var colorIdx = getColor(cell.countNegsAround);
      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      elCell.style.color = `${colorIdx}`;
    }
  }
}

function getColor(idxColor) {
  var colors = [
    'yellow',
    'blue',
    'orange',
    'red',
    'purple',
    'green',
    'brown',
    'pink',
  ];
  for (let i = idxColor; i < colors.length; i++) {
    return colors[i];
  }
}

function showCell(elCell, cell) {
  if (cell.isShown) return;
  if (cell.isMarked) return;
  if (cell.isMine) {
    elCell.innerText = MINE;
  } else if (cell.minesAroundCount) elCell.innerText = cell.minesAroundCount;
  else if (!cell.minesAroundCount) elCell.innerText = EMPTY;
  elCell.style.opacity = 1;
  cell.isShown = true;
}

function setGameLevel(levelSize = 10) {
  gBoard = [];
  gLevel.size = levelSize;

  if (levelSize === 4) gLevel.mines = 2;
  if (levelSize === 8) gLevel.mines = 12;
  if (levelSize === 12) gLevel.mines = 30;

  var gBoard = createBoardGame(levelSize);
  getCreateTable(gBoard);
  gIsFirstCellClick = false;

  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      if (levelSize === 8) elCell.classList.add('med-table');
      if (levelSize === 12) elCell.classList.add('lrg-table');
    }
  }
}
