'use strict';
var gIsFirstCellClick = false;
var gTimer = false;
var gIsHintOn = false;
var gCurrCells = [];
var gCurrElCells = [];
var gSafeCount = 3;
var manPosMine = false;
var gManPosCount = 0;
var gCellsDetails = [];
var gIsSevenBoom = false;
var gMinesElCells = [];
function getCreateTable(board) {
  var tableTarget = document.querySelector('.table-container');
  var table = '';
  for (var i = 0; i < board[0].length; i++) {
    table += '<tr class="row-prop">';
    const row = board[i];
    for (var j = 0; j < row.length; j++) {
      // var colorIdx = pickColors(row[j].minesAroundCount);
      table += `<td data-i="${i}" data-j="${j}" class="cell-prop" oncontextmenu="onRightClick(this,event,${i},${j})" onclick="onLeftClick(this,event,${i},${j})">${row[j].minesAroundCount}</td>`;
    }
    table += '</tr>';
  }

  tableTarget.innerHTML = '<table class="main-table">' + table + '</table>';

  return document.querySelector('.main-table');
}

// handle rightClick event
function onRightClick(elCell, ev, i, j) {
  ev.preventDefault();
  var cell = gBoard[i][j];
  if (!gIsFirstCellClick) {
    gGame.isOn = true;
    addMines(i, j);
    countNegsAround(gLevel.size);
    gMinesLocation = [];
    renderColors();
    gIsFirstCellClick = true;
  }
  gCellsDetails.push(cell);
  if (!gTimer) {
    startStopper();
    gTimer = true;
  }
  if (!gGame.isOn) return;
  renderFlag(cell, elCell);
  cell.isMarked = !cell.isMarked;
  checkGameOver(cell);
}
// Render flag with right click
function renderFlag(cell, elCell) {
  if (cell.isShown) return;
  if (!cell.isMarked) {
    elCell.style.opacity = 1;
    elCell.classList.remove('cell-prop');
    elCell.classList.add('curr-flag');
    elCell.innerHTML = `<span>${FLAG}</span>`;
  }
  if (cell.isMarked) {
    elCell.classList.add('cell-prop');
    elCell.classList.remove('curr-flag');
    elCell.style.opacity = 0;
    elCell.innerHTML = cell.minesAroundCount;
  }
}
// render color for each number
function renderColors() {
  for (var i = 0; i < gBoard.length; i++) {
    var row = gBoard[i];
    for (let j = 0; j < row.length; j++) {
      var cell = row[j];
      var colorIdx = getColor(row[j].minesAroundCount);
      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      elCell.style.color = `${colorIdx}`;
      // for expose all mines when game over
      if (cell.isMine) gMinesLocation.push(cell);
    }
  }
}

function onLeftClick(elCell, ev, i, j) {
  var cell = gBoard[i][j];
  if (cell.exploded) return;
  if (gIsSevenBoom) {
    countNegsAround(gLevel.size);
    gMinesLocation = [];
    gIsFirstCellClick = true;
    gIsSevenBoom = false;
  }
  if (manPosMine) {
    gIsFirstCellClick = true;
    gManPosCount--;
    setManPosMines(i, j, elCell);
    console.log('leftclick', gManPosCount);
    return;
  }
  if (!gIsFirstCellClick) {
    gGame.isOn = true;
    addMines(i, j);
    countNegsAround(gLevel.size);
    gMinesLocation = [];
    gIsFirstCellClick = true;
    gCellsDetails.push(cell);
  }
  renderColors();
  gCellsDetails.push(cell);
  if (gIsHintOn) {
    var changeLightisOn = document.querySelector('.isOn');
    changeLightisOn.classList.remove('isOn');
    changeLightisOn.classList.toggle('light-stay-on');
    openNegsCells(ev);
    return;
  }
  if (!gTimer) {
    startStopper();
    gTimer = true;
  }
  if (!gGame.isOn) return;
  showCell(elCell, cell);
  if (cell.minesAroundCount === 0 && !cell.isMine && !cell.isMarked)
    openEmptyCells(gBoard, i, j);
  checkGameOver(cell, elCell);
}
// show render cells
function showCell(elCell, cell) {
  if (cell.isShown) return;
  if (cell.isMarked) return;
  if (cell.isMine) {
    elCell.innerHTML = MINE;
    mineSound.play();
    gLossCounter++;
  } else if (cell.minesAroundCount) elCell.innerHTML = cell.minesAroundCount;
  else if (!cell.minesAroundCount) elCell.innerHTML = EMPTY;
  elCell.style.opacity = 1;
  cell.isShown = true;
}
// hide render cells
function hideCell(elCell, cell) {
  if (cell.isShown) return;
  if (cell.isMarked) return;
  if (cell.isMine) {
    elCell.innerHTML = MINE;
  } else if (cell.minesAroundCount) elCell.innerHTML = cell.minesAroundCount;
  else if (!cell.minesAroundCount) elCell.innerHTML = EMPTY;
  elCell.style.opacity = 0;
  cell.isShown = false;
}
// toggle lights with hints
function onToggleHint(elLight) {
  if (!gIsFirstCellClick) {
    alert('please click cell first');
    return;
  }
  var lights = document.querySelector('.isOn');
  if (lights) return;
  if (elLight.className === 'isOff') {
    elLight.src = 'assets/img/on.png';
    elLight.className = 'isOn';
    gIsHintOn = true;
  } else if (elLight.className === 'isOn') {
    elLight.src = 'assets/img/off.png';
    elLight.className = 'isOff';
    gIsHintOn = false;
  }
}

function openNegsCells(event) {
  if (!gIsHintOn) return;
  var cellI = parseInt(event.target.dataset.i);
  var cellJ = parseInt(event.target.dataset.j);

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j > gBoard[i].length - 1) continue;
      if (gBoard[i][j].isShown === true) continue;
      var cell = gBoard[i][j];
      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);

      gCurrCells.push(cell);
      gCurrElCells.push(elCell);
      for (let i = 0; i < gCurrElCells.length; i++) {
        showCell(gCurrElCells[i], gCurrCells[i]);
        gCurrCells[i].isShown = true;
        console.log(10);
      }
      setTimeout(function () {
        for (let i = 0; i < gCurrElCells.length; i++) {
          hideCell(gCurrElCells[i], gCurrElCells[i]);
          gCurrCells[i].isShown = false;
        }
        gCurrElCells = [];
        gCurrCells = [];
      }, 1000);
    }
  }
  gIsHintOn = false;
}

function onSafeClick() {
  if (!gIsFirstCellClick) {
    alert('please click on cell');
    return;
  }
  var safeStr = document.querySelector('.safe-text');
  if (gSafeCount === 0) {
    safeStr.innerText = 'Sorry no clicks!';
    return;
  }
  gSafeCount--;
  safeStr.innerText = `${gSafeCount} click available`;
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[i].length; j++) {
      var randI = getRandomInt(0, gLevel.size);
      var randJ = getRandomInt(0, gLevel.size);
      if (gBoard[randI][randJ].isShown || gBoard[randI][randJ].isMine) continue;
      var elCell = document.querySelector(
        `[data-i="${randI}"][data-j="${randJ}"]`
      );
      elCell.classList.remove('cell-prop');
      if (elCell.innerHTML) elCell.innerHTML = '';
      elCell.style.opacity = 1;
      elCell.classList.add('mark-cell');
      setTimeout(function () {
        elCell.classList.remove('mark-cell');
        elCell.classList.add('cell-prop');
        elCell.style.opacity = 0;
      }, 1000);
      return;
    }
  }
}

function getUserMineCount() {
  if (gIsFirstCellClick) {
    alert('You cant pos after cell click');
    return;
  }
  gManPosCount = +prompt('How many mines do you want to add?');
  document.querySelector(
    '.posmine-text'
  ).innerHTML = `Left:${gManPosCount} mines`;
  manPosMine = true;
  gLevel.mines = gManPosCount;
}

function setManPosMines(i, j, elCell) {
  if (gManPosCount < 0) {
    for (let i = 0; i < gMinesElCells.length; i++) {
      gMinesElCells[i].classList.remove('mark-cell');
      gMinesElCells[i].classList.add('cell-prop');
    }
    alert('you pos all our mines!');
    manPosMine = false;
    gGame.isOn = true;
    countNegsAround(gLevel.size);
    gMinesLocation = [];
    gMinesElCells = [];
    return;
  }
  gMinesElCells.push(elCell);
  document.querySelector(
    '.posmine-text'
  ).innerHTML = `Left: ${gManPosCount} mines`;
  var cell = gBoard[i][j];
  elCell.classList.remove('cell-prop');
  cell.isMine = true;
  elCell.classList.add('mark-cell');
}

function gameStepBack() {
  var lastCell = gCellsDetails.pop();
  var cell = gBoard[lastCell.i][lastCell.j];
  var elCell = document.querySelector(
    `[data-i="${lastCell.i}"][data-j="${lastCell.j}"]`
  );

  if (gCellsDetails.length === 0) {
    alert('you already in the beginning!');
  }
  if (cell.isShown) {
    cell.isShown = false;
    hideCell(elCell, cell);
  }
  if (cell.isMine) {
    document.querySelector('.lives-count').innerHTML += '❤️';
    hideCell(elCell, cell);
  }
  if (cell.isMarked) {
    elCell.style.opacity = 0;
    elCell.classList.remove('curr-flag');
    elCell.classList.add('cell-prop');
    elCell.innerHTML = `<span></span>`;
  }
}

function sevenBoom() {
  if (gIsFirstCellClick) {
    alert('You cant activate after cell click');
    return;
  }
  gLevel.mines = 0;
  var counter = 0;
  for (let i = 0; i < gBoard.length; i++) {
    var row = gBoard[i];
    for (let j = 0; j < row.length; j++) {
      var cell = row[j];
      counter++;
      if (counter % 7 === 0 || (counter - 7) % 10 === 0) {
        cell.isMine = true;
        gLevel.mines++;
        console.log(counter, 'i:', i, 'j:', j);
      }
    }
  }
  gIsSevenBoom = true;
  console.log(gLevel.mines);
}

function openEmptyCells(board, cellI, cellJ) {
  var neighbors = findNeighbors(board, cellI, cellJ);
  for (let i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (neighbor.isMarked || neighbor.isShown || neighbor.isMine) continue;
    var elCell = document.querySelector(
      `[data-i="${neighbor.i}"][data-j="${neighbor.j}"]`
    );
    gCellsDetails.push(neighbor);
    showCell(elCell, neighbor);
    if (neighbor.minesAroundCount) continue;
    openEmptyCells(board, neighbor.i, neighbor.j);
  }
}
