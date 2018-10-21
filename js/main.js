
var header = require('../modules/header/headerView.js');
var router = require('./router.js');

require('css/base.css');


$(function() {
  window.config = {}
  window.userInfo = {}
  new header();
  window.AppRouter = new router();
  Backbone.history.stop();
  Backbone.history.start();
});