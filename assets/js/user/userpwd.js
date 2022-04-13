$(function(){
    let form = layui.form;
    let layer = layui.layer;

    // 自定义表单校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        // 新密码与原密码不能相同
        samePwd: function(value){
            if(value === $('input[name=oldPwd]').val()){
                return '新密码不能与原密码相同';
            }
        },
        // 新密码与确认密码相同
        equalPwd: function(value){
            if(value !== $('input[name=newPwd]').val()){
                return '两次输入的密码不相同';
            }
        }
    });

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(event){
        // 阻止默认提交行为
        event.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    // 修改失败
                    $('.layui-form')[0].reset();
                    return layer.msg('原密码错误');
                }
                // 更新成功
                layer.msg('更新成功');
                // 重置表单
                // reset()为原生dom的方法，需要拿到原生dom对象
                // console.log(this);
                // 注意：回调里面的this不是$('.layui-form')
                $('.layui-form')[0].reset();
            }
        });
    });
});