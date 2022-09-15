/**
 *
 * @param {object} vector1 object x y z of location
 * @param {object} vector2  object position player
 * @param {number} distance distance
 * @returns {boolean} true / false
 */
export function distance2d(vector1, vector2, distance) {
  let dist = Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
  if (dist < distance) {
    return dist;
  } else {
    return false;
  }
}
