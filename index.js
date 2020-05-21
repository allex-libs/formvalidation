function createLib (execlib) {
  return require('./weblib')(execlib);
}
module.exports = createLib;
