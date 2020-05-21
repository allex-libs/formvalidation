function createWebLib (execlib) {
  'use strict';

  return {
    mixins: require('./mixins')(execlib)
  };
}
module.exports = createWebLib;
