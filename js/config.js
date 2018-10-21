/**
 * Created by qin on 2017/6/12.
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var smartPage = {
    appRouter: null,
	   searchPara: {},
    backboneViewObj: {
    },
    domEl: {
        headerEl: '#app',
        mainEl:'.secondMenuDisplay'
    }
};