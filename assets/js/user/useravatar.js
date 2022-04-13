$(function(){
    let layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    $('#chooseFile').click(function(){
        $('#file').click();
    });

    // 为文件选择框绑定change事件
    $('#file').on('change', function(event){
        // 拿到用户选择的文件
        // event.target.files 伪数组
        // console.log(event.target.files);
        if(event.target.files.length === 0){
            return layer.msg('请选择照片');
        }

        // 用户选择了文件
        let file = event.target.files[0];
        let imgURL = URL.createObjectURL(file);
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', imgURL)  // 重新设置图片路径
        .cropper(options);       // 重新初始化裁剪区域
    });

    // 为确定按钮绑定点击事件
    $('.btnSure').click(function(){
        let dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 发起请求更换图片
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res){
                if(res.status !== 0){
                    // 更换失败
                    return layer.msg('更换头像失败');
                }
                // 更新成功
                layer.msg('更换头像成功');
                // 重新渲染
                window.parent.getUserInfo();
            }
        });
    });
});