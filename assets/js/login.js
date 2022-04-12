$(function(){
    // 127.0.0.1
    // http://www.liulongbin.top:3007
    const rootUrl = 'http://127.0.0.1';
    // 客户端发起所有ajax请求前会进入这个过滤器，参数options是我们发起的请求的配置对象
    // 统一拼接请求的根路径
    $.ajaxPrefilter(function(options){
        options.url = rootUrl + options.url;
    });

    // 失败案例
    // 在回调函数中，我使用了箭头函数，并且使用了this
    // 在箭头函数中，this的指向和箭头函数声明所在的作用域中的指向相同，在这个例子中，也就是window
    // // 点击 去注册账号
    // console.log($('#aL'));
    // $('#aL').click(() => {
    //     console.log($(this));
    //     $(this).toggleClass('hidden');
    //     $('#aR').toggleClass('hidden');
    // });

    // // 点击 去登录
    // $('#aR').click(() => {
    //     $(this).toggleClass('hidden');
    //     $('#aL').toggleClass('hidden');
    // });

    // 点击 去注册账号
    // 这里是注册面板和登录面板的切换
    $('#aL').click(function(){
        // $('.login').toggleClass('hidden');
        // $('.register').toggleClass('hidden');

        // 除了可以toggle类名
        // 也可以使用jquery中的show和hide
        // jquery会自动帮我们display:none和display:block
        $('.login').hide();
        $('.register').show();
    });

    // 点击 去登录
    $('#aR').click(function(){
        // $('.login').toggleClass('hidden');
        // $('.register').toggleClass('hidden');

        $('.login').show();
        $('.register').hide()
    });

    // 使用layUI的自定义校验规则
    // 自定义规则myPassword校验密码，出现非空白符6-12次
    let form = layui.form;
    form.verify({
        // 数组方式
        myPassword: [/^[\S]{6,12}/, '密码必须为6-12位非空白字符'],
        // 函数方式
        rePassword: function(value, item){
            // 再次输入密码校验
            // value参数为表单项的值
            // item为表单项的dom元素对象

            // 第一个密码表单的值
            const pass = $('.register input[name=password]').val();
            if(pass !== value){
                return '两次输入的密码不一致';
            }
        }
    });

    // 监听注册表单的提交事件
    $('.register form').on('submit', function(event){
        // 阻止表单默认提交
        event.preventDefault();
        // 发起请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                // 请求参数
                username: $(this).find('input[name=username]').val(),
                password: $(this).find('input[name=password]').val()
            },
            success: function(res){
                // 成功的回调
                // status为0，则注册成功
                if(res.status !== 0){
                    // 最有可能是用户名冲突
                    // 用户名被占用，请更换其他用户名！
                    // return console.log('注册失败 ' + res.message);

                    // layui自动弹出提示
                    return layui.layer.msg(res.message);
                }
                // console.log('注册成功');
                layui.layer.msg('注册成功 快去登录吧');
                // 切换为登录表单
                $('#aR').click();
            }
        });
    });

    // 监听登录表单的提交事件
    $('.login form').on('submit', function(event){
        // 阻止表单默认提交
        event.preventDefault();
        // 发起请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            // 利用jQuery的serialize()方法可以快速获取表单数据 不需要手动拼接了
            data: $(this).serialize(),
            // data: {
            //     // 请求参数
            //     username: $(this).find('input[name=username]').val(),
            //     password: $(this).find('input[name=password]').val()
            // },
            success: function(res){
                // console.log(res);
                // 成功的回调
                // 返回的res.token表明身份
                // status为0，则登录成功
                if(res.status !== 0){
                    // 登陆失败
                    // layui自动弹出提示
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('登录成功');
                // 把token字符串保存到本地存储
                // 当客户端再次发起请求时，通过请求头的Authorization字段将Token发送给服务器
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = './index.html';
            }
        });
    });
});