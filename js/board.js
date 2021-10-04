'use strick';

// creating board game
function createBoardGame(boardSize = 10) {
  gBoard = [];
  // initialize sub arrays of model matrix
  for (let i = 0; i < boardSize; i++) {
    gBoard[i] = [];
    for (let j = 0; j < boardSize; j++) {
      gBoard[i][j] = createCells(i, j);
    }
  }
  return gBoard;
}

function addMines(cellI, cellJ) {
  var minesToAdd = gLevel.mines;
  var cellsCollect = [];

  for (let i = 0; i < gBoard[0].length; i++) {
    var row = gBoard[i];
    for (let j = 0; j < row.length; j++) {
      var cell = row[j];
      if (cell.i === cellI && cell.j === cellJ) continue;
      cellsCollect.push(cell);
    }
  }
  while (minesToAdd > 0) {
    var randCell = cellsCollect[getRandomInt(0, cellsCollect.length - 1)];
    var random = Math.random() < 1 / (gLevel.size * gLevel.size);
    if (random && !randCell.isMine) {
      randCell.isMine = true;
      minesToAdd--;
    }
  }
  if (cell.isMine) gMinesLocation.push(cell);
}

function countNegsAround(boardSize) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      // find neighbours
      var neighbors = findNeighbors(gBoard, i, j);
      var mineCount = 0;
      //get Mine count
      for (let i = 0; i < neighbors.length; i++) {
        var neighborCell = neighbors[i];
        if (neighborCell.isMine) mineCount++;
      }
      gBoard[i][j].minesAroundCount = mineCount;
    }
  }
  return gBoard;
}

function findNeighbors(board, cellI, cellJ) {
  var neighbors = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (let j = cellJ - 1; j <= cellJ + 1; j++) {
      //exlude target cell
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j > board[i].length - 1) continue;
      neighbors.push(board[i][j]);
    }
  }
  return neighbors;
}

function createCells(i, j) {
  return {
    isShown: false,
    isMarked: false,
    isMine: false,
    minesAroundCount: 0,
    i: i,
    j: j,
  };
}
