// 127.0.0.1
// http://www.liulongbin.top:3007
const rootUrl = 'http://www.liulongbin.top:3007';
// 客户端发起所有ajax请求前会进入这个过滤器，参数options是我们发起的请求的配置对象
// 统一拼接请求的根路径
$.ajaxPrefilter(function(options){
    options.url = rootUrl + options.url;

    // 统一为有权限的接口设置请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        },
        
        // 无论ajax成功还是失败，都会调用complete
        options.complete = function(res){
            // res.responseJSON为服务器响应的数据
            // console.log(res.responseJSON);
            
            if(res.responseJSON.status === 1){
                // 强制清空token
                localStorage.removeItem('token');
                // 跳转到登录页
                location.href = './login.html';
            }
        }
    }
    
});