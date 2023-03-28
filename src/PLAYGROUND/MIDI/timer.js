var lastTick = 0;
var ppq = 24;
var bpm = 100;
var tickRate = 60000 / (bpm * ppq);
function tick() {
  let now = performance.now();
  if (lastTick === 0) {
    lastTick = now;
  }
  postMessage({});
  timeout = tickRate; //27.77777777777778
  var offset = now - lastTick - tickRate;
  timeout -= offset;
  setTimeout(tick, timeout);

  lastTick = now;
}
tick();
