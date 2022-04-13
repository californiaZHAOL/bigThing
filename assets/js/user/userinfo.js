$(function(){
    let form = layui.form;
    let layer = layui.layer;

    // 初始化给用户名赋值
    initUserInfo();

    // 自定义验证规则
    form.verify({
        nickname: function(value){
            if(value.value > 6){
                return '昵称长度必须为1-6位字符';
            }
        }
    });

    function initUserInfo(){
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function(res){
                if(res.status !== 0){
                    // 失败
                    return layer.msg('获取用户信息失败');
                }
                
                // 为用户名表单赋值
                // layui表单快速赋值

                //给表单赋值
                // form.val("formTest", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                //     "username": "贤心" // "name": "value"
                //     ,"sex": "女"
                //     ,"auth": 3
                //     ,"check[write]": true
                //     ,"open": false
                //     ,"desc": "我爱layui"
                // });
                
                // //获取表单区域所有值
                // var data1 = form.val("formTest");

                // 隐藏域也会被填充
                form.val('userinfo', res.data);
            }
        }); 
    }

    // 重置按钮
    $('button[type=reset]').click(function(event){
        // 阻止默认重置行为
        event.preventDefault();
        // 获取用户默认信息
        initUserInfo();
    });

    // 表单数据的提交
    $('button[type=submit]').click(function(event){
        // 阻止默认提交行为
        event.preventDefault();
        // 发起请求提交修改
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $('form').serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败');
                }
                // 更新成功
                layer.msg('更新用户信息成功');
                // 左侧侧边栏更改欢迎名称为昵称nickname
                // 调用父页面的方法来重新渲染
                // 这里的window表示iframe窗口
                window.parent.getUserInfo();
            }
        });
    });
});