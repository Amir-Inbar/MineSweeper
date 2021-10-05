'use strict';

var gStopperStart = false;
function renderTime() {
  if (!gStopperStart) {
    startStopper();
    gStopperStart = true;
  }
}
// convert time
function timeTostring(time) {
  if (!time) time = 1;
  var diffInHrs = time / 3600000;
  var hh = Math.floor(diffInHrs);

  var diffInMin = (diffInHrs - hh) * 60;
  var mm = Math.floor(diffInMin);

  var diffInSec = (diffInMin - mm) * 60;
  var ss = Math.floor(diffInSec);

  var diffInMS = (diffInSec - ss) * 100;
  var ms = Math.floor(diffInMS);

  var formattedMM = mm.toString().padStart(2, '0');
  var formattedSS = ss.toString().padStart(2, '0');
  var formattedMS = ms.toString().padStart(2, '0');

  return `${formattedMM}:${formattedSS}:${formattedMS}`;
}
var gStopper = document.querySelector('#display');
// display time on selected element
function displayTime(txt) {
  var stopper = document.querySelector('#display');
  stopper.innerHTML = txt;
}

var gGameStartTime = null;
function startStopper() {
  gGameStartTime = Date.now();
  timerInterval = setInterval(function printTime() {
    gElapsedTime = Date.now() - gGameStartTime;

    displayTime(timeTostring(gElapsedTime));
  }, 10);
}
function pauseStopper() {
  clearInterval(timerInterval);
}

function resetStopper() {
  clearInterval(timerInterval);
  displayTime('00:00:00');
  gElapsedTime = 0;
}
