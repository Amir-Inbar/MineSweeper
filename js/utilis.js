'use strict';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function setLSItem(key, item) {
  let storeItem = null;
  if (typeof item === 'object') storeItem = JSON.stringify(item);
  localStorage.setItem(key, storeItem);
}

function getLSItem(key) {
  const item = localStorage.getItem(key);
  try {
    return JSON.parse(item);
  } catch (e) {
    return item;
  }
}

function logTMat(boardMatrix) {
  console.log(
    '🚀 ~ file: dom.js ~ line 163 ~ logTMat ~ boardMatrix',
    boardMatrix
  );
  console.table(
    boardMatrix.map((arr) =>
      arr.map((cell) =>
        cell.isMine ? 'MINE' : cell.minesAroundCount ? cell.minesAroundCount : 0
      )
    )
  );
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
  for (var i = idxColor; i < colors.length; i++) {
    return colors[idxColor];
  }
}
