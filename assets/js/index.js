$(function(){
    // 获取用户信息
    getUserInfo();

    // 为退出链接绑定点击事件
    $('#btnLogout').click(function(){
        // 用layui的方法
        // 之所以可以这样用是因为在前面layui.use了layer，可以直接使用
        layui.layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 点击确认之后的回调
            // 清空token
            localStorage.removeItem('token');
            // 跳转回登录页
            location.href = './login.html';
            // 关闭confrim询问框弹出层
            layui.layer.close(index);
        });
    });

    let a = 1;
});

// 这里不把这个函数写到jQuery入口函数里面是因为在iframe里面会访问到这个方法
// 要放到全局作用域
function getUserInfo(){
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        
        // 在请求头中配置Token
        // 这一步已经包含在rootUrl.js中了

        success: function(res){
            // console.log(res);
            // {status: 0, message: '获取用户基本信息成功！', data: {…}}
            // data: {id: 16488, username: 'lelele', nickname: '', email: '', user_pic: null}
            // message: "获取用户基本信息成功！"
            // status: 0
            // [[Prototype]]: Object

            if(res.status !== 0){
                // 请求失败
                // 表明用户登录信息过期，要重新登录
                // 且不需要渲染头像
                return layui.use(['layer'], function(){
                    layui.layer.msg('请登录后再操作', {icon: 5, time: 2000});
                });
            }
            // 请求成功
            // 渲染用户头像
            renderAvater(res.data);
        },

        // 无论ajax成功还是失败，都会调用complete
        complete: function(res){
            // res.responseJSON为服务器响应的数据
            // console.log(res.responseJSON);
            
            if(res.responseJSON.status === 1){
                // 强制清空token
                localStorage.removeItem('token');
                // 跳转到登录页
                location.href = './login.html';
            }
        }
    });
}

// 渲染头像函数
function renderAvater(data){
    // nickname优先 username其次
    const name = data.nickname || data.username;
    // 判断用户是否设置了头像
    if(data.user_pic){
        // 渲染用户自己设置的头像
        $('a.userinfo').html(`
                <img src="data.user_pic" class="layui-nav-img">
                个人中心<i class="layui-nav-more"></i>`);
        $('div.userinfo').html(`
                <img src="data.user_pic" class="layui-nav-img">
                <span class="welcome">${'欢迎 ' + name}</span>`);
        
        $('.layui-nav-img').attr('src', data.user_pic);
    }
    else{
        // 渲染文字头像
        $('a.userinfo').html(` 
                <img src="" class="layui-nav-img"  style="display: none;">
                <span class="text-avatar">${name[0].toUpperCase()}</span>
                个人中心<i class="layui-nav-more"></i>`);
        $('div.userinfo').html(`
                <span class="text-avatar">${name[0].toUpperCase()}</span>
                <span class="welcome">${'欢迎 ' + name}</span>`);
    }
} 