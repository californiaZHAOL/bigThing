// 127.0.0.1
// http://www.liulongbin.top:3007
const rootUrl = 'http://127.0.0.1';
// 客户端发起所有ajax请求前会进入这个过滤器，参数options是我们发起的请求的配置对象
// 统一拼接请求的根路径
$.ajaxPrefilter(function(options){
    options.url = rootUrl + options.url;

    // 统一为有权限的接口设置请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
});