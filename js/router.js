
var Routes =  Backbone.Router.extend({
  routes: {
    'entry-base': 'entry',
    'stats': 'statistics'
  },
  entry:function(){
    require.ensure([], function (require) {
      var entryView = require('../modules/main/entry/entryListView.js');
      smartPage.backboneViewObj['entryViewObj'] = new entryView();
    });
  },
  statistics:function(){
    require.ensure([], function (require) {
      var statisticsView = require('../modules/main/statistics/statisticsView.js');
      smartPage.backboneViewObj['statisticsViewObj'] = new statisticsView();
    });
  },
  openPage: function(url) {
    this.navigate(url,{trigger: true});
  },
  execute: function(callback,args,name) {   // 防止重复绑定事件
    layer.closeAll()
    $(smartPage.domEl.mainEl).undelegate()
    if (callback) callback.apply(this, args);
  }
});

module.exports = Routes;