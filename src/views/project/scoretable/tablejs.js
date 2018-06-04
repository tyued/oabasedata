// 获取地址栏
function getParames(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// var xxdm=getParames('xxdm');
// var xmid=getParames('xmid');
// var rwid=getParames('rwid');
// var bjid=getParames('bjid');


