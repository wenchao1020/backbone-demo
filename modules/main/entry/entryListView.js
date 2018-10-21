/**
 * Created by qin on 2018/3/12.
 */
var entryListTemplate = require('html!./entryList.html'),
  entryFormTemplate = require('html!./entryForm.html');

var productListModel = Backbone.Model.extend({   //商品列表
  url: 'common/dict/get.do'
});

var recordInfoModel = Backbone.Model.extend({   //当前用户信息 节点 、企业
  url: 'entry-base/get-basic-info.do'
});

var bizListModel = Backbone.Model.extend({   //供应商列表
  url: 'entry-base/list-bizs.do'
});

var addModel = Backbone.Model.extend({   //入场登记
  url: 'entry-base/add.do'
})

var listModel = Backbone.Model.extend({   //查询列表
  url: 'entry-base/list.do'
});

var entryListView = Backbone.View.extend({
  el: smartPage.domEl.mainEl,
  template: _.template(entryListTemplate, {variable: 'data'}),
  events: {
    'click #add': 'addForm'
  },
  initialize: function() {
    var that = this;
    that.model = new listModel();
    that.uerInfo = {}
    that.userModel = new recordInfoModel();
    that.userModel.fetch();
    new productListModel().fetch({
      data: {
        type: 'commodity'
      },
      success: function (model, res) {
        that.productList = res.result
      }
    })
    new bizListModel().fetch({
      success: function (model, res) {
        that.bizList = res.result
      }
    })
    that.listenTo(that.userModel, 'sync', that.setUserInfo)
    that.searchPara = {
      pageNo: 1,
      pageSize: 10
    }
    that.addModel = new addModel();
    that.$el.html(that.template({}));
    that.renderDate()
    //日期范围
  },
  setUserInfo: function (res) {
    var that = this;
    res = res.toJSON()
    if (res.status === 'OK') {
      that.info = res.result
    }
  },
  addForm: function (formData) {
    var that = this,
      commodityName = '',
      title = '商品进场信息';
    var compiled = _.template(entryFormTemplate, {variable: 'data'});
    var html = compiled({userInfo: that.info, productList: that.productList, bizList: that.bizList});
    that.addModel.clear();
    var dialog = layui.layer.open({
      type: 1,
      btn: ['确认', '取消'],
      title: title,
      shade: 0.1,
      shadeClose: true,
      closeBtn:'1',
      area: ['600px', '500px'],
      content: html, //捕获的元素
      success: function (layero){
        that.form.render();
        that.form.on('select(commodity)', function(data){
          console.log(data.elem); //得到select原始DOM对象
          console.log(data.value); //得到被选中的值
          $(layero).find('#commodictCode').val(data.value)
          commodityName = $.trim(data.othis.find('input').val().replace('- ' + data.value, ''))
        });
        that.form.on('select(cbiz)', function(data){
          console.log(data.elem); //得到select原始DOM对象
          console.log(data.value); //得到被选中的值
          console.log(_.findWhere(that.info.bizs, {bizCode: data.value}))
        });
        that.form.on('select(biz)', function(data){
          console.log(data.elem); //得到select原始DOM对象
          console.log(data.value); //得到被选中的值
          _.findWhere(that.bizList, {bizCode: data.value})
        });

        that.form.on('submit(entryBaseForm)', function(data){
          var json = {},cbiz = {}, pbiz = {};
          cbiz = _.findWhere(that.info.bizs, {bizCode: data.field.cbizCode})
          if (data.field.pnodeCode){
            pbiz = _.findWhere(that.bizList, {bizCode: data.field.pnodeCode})
          }
          json = {
            pnodeCode: pbiz.nodeCode || '',
            pnodeName: pbiz.nodeName || '',
            pbizCode: pbiz.bizCode || '',
            pbizName: pbiz.bizName || '',
            cnodeCode: that.info.nodeCode,
            cnodeName: that.info.nodeName,
            cbizCode: cbiz.bizCode,
            cbizName: cbiz.bizName,
            nodeType: that.info.nodeType,
            commodityCode: data.field.commodityCode,
            commodityName: commodityName,
            quantity: data.field.quantity,
            price: data.field.price
          }
		        layer.confirm('确认提交吗？', function(index){
            that.addModel.save(json,{
              type: 'POST',
              success: function (model, res) {
                layui.layer.msg('添加成功')
                layui.layer.close(dialog);
                that.search()
						        }
				        })
				        layer.close(index);
		        });
          return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
      },
      btn1: function (index, layero) {
        $(layero).find('button').trigger('click')
      },
      btn2: function () {
        layui.layer.close(dialog);
      },
      end: function() {
      }
    })
  },
  search: function (pageNo, first) {
    var that = this;
    if (typeof pageNo !== 'number') {
      pageNo = 1
    }
    that.model.fetch({
      data: {
        cbizName: that.searchPara.cbizName,
        pbizName: that.searchPara.pbizName,
        commodityName: that.searchPara.commodityName,
        startDate: that.searchPara.startDate,
        endDate: that.searchPara.endDate,
        pageNo: pageNo || that.searchPara.pageNo,
        pageSize: that.searchPara.pageSize
      },
      success: function (res) {
        res = res.toJSON();
        if(res.status == 'OK'){
          that.renderTable(res.result.entryBaseList || [])
          if(!first){
            that.laypage(res.result.page)
          }
        }
      },
      complete: function () {
      }
    });
  },
  renderDate: function  () {
    var that = this;
    layui.laydate.render ({
      elem: '#date',
      range: true,
      value: that.searchPara.date,
      done: function (value, date, endDate) {
      }
    });
    layui.use ('form', function () {
      that.form = layui.form;
      that.form.on ('submit(searchEntry)', function (data, aa) {
        that.searchPara.cbizName = data.field.cbizName;
        that.searchPara.pbizName = data.field.pbizName;
        that.searchPara.commodityName = data.field.commodityName
        that.searchPara.date = data.field.date
        that.searchPara.startDate = data.field.date ? data.field.date.substr (0, 10) : '';
        that.searchPara.endDate = data.field.date ? data.field.date.substr (13, 10) : '';
        that.search ();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
      that.form.render ();
    })
    that.search ();
  },
  renderTable: function  (data) {
    layui.table.render({
      elem: '#entryList',
      cols: [[
        {field:'cbizName', title: '零售商名称'},
        {field:'pbizName', title: '供应商名称'},
        {field:'pnodeName', title: '供应节点名称'},
        {field:'commodityName', title: '商品名称'},
        {field:'quantity', title: '重量（kg）'},
        {field:'price', title: '单价（元/kg）'},
        {field:'entryDate', title: '进场日期'}
      ]],
      data: data
    });
  },
  response: function (data){
    var that = this
    that.addForm(data)
  },
  laypage: function (count) {
    var that = this;
    if(count.total > 0){
      $('#page').show()
      layui.laypage.render({
        elem: 'page',
        limit: count.pageSize,
        count: count.total,
        layout: ['count', 'prev', 'page', 'next', 'skip'],
        jump: function(obj, first){
          if(!first){
            that.search(obj.curr, 'done');
          }
        }
      })
    } else{
      $('#page').hide()
    }
  }
});
module.exports = entryListView;