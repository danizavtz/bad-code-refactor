(function() {
  'use strict';
  const express = require('express');
  const router = express.Router();
  router.use(require('./routes/pokemon.router'));

  module.exports = router;
}());
