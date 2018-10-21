
var template = require('html!./header.html');
require('./header.css');

var headerView = Backbone.View.extend({
    el: smartPage.domEl.headerEl,
    template: _.template(template, {variable: 'data'}),
    events: {
      'click .menu-list-second': 'setActive'
    },
    initialize: function() {
      var userInfo = {
        account: 'test'
      };
      $(this.template({'userInfo': userInfo})).prependTo(this.el);
    }
});
module.exports = headerView;