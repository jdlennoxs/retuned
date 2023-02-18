export function shuffle(array) {
  const result = array;
  let curId = array.length;
  // There remain elements to shuffle
  while (0 !== curId) {
    // Pick a remaining element
    const randId = Math.floor(Math.random() * curId);
    curId -= 1;
    // Swap it with the current element.
    const tmp = result[curId];
    result[curId] = result[randId];
    result[randId] = tmp;
  }
  return result;
}
