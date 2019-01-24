export const hasObstacle = (x, y, obstacles) => {
  //console.log(typeof obstacles, obstacles);
  return new Set(obstacles).has(JSON.stringify({ x: x, y: y }));
}

export const at = (x, y) => {
  return document.querySelector(`#player1-board [x="${x}"][y="${y}"]`);
}

export const enemyAt = (x, y) => {
  return document.querySelector(`#player2-board [x="${x}"][y="${y}"]`);
}

export const isSame = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}
