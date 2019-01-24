exports.isSamePosition = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

exports.positionOverlaps = (positionToCompare, positions = []) => {
  let doesItOverlap = false;
  positions.forEach(position => {
    if (isSamePosition(positionToCompare, position)) {
      doesItOverlap = true;
    }
  });
  return doesItOverlap;
};

exports.ZERO = {x: 0, y: 0};