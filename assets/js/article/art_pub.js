$(function(){
    let layer = layui.layer;
    let form = layui.form;

    // 获取文章分类并渲染
    function getList(){
        // 发起请求
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    // 获取失败
                    return layer.msg('初始化文章分类失败', {icon: 5, time: 800});
                }

                // 获取成功
                // 渲染
                let html = res.data.map((item => item.is_delete ? '' : `<option value="${item.Id}">${item.name}</option>`)).join('');
                $('[name=cate_id]').html(`<option value="">请选择文章类别</option>` + html);
                // 重新渲染表单
                form.render();
            }
        });
    }

    getList();

    // 启用富文本编辑器
    initEditor();

    // 图片裁剪
     // 1. 初始化图片裁剪器
    let $image = $('#image')
    
    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定点击事件
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

    // 定义文章的发布状态
    let art_state = '已发布';
    $('.caogao').click(function(){
        art_state = '草稿';
    });

    // 监听表单的提交事件
    $('.form_put').on('submit', function(event){
        // 阻止默认提交
        event.preventDefault();
        // 快速创建formDtae对象
        let fd = new FormData($(this)[0]);
        fd.append('state', art_state);

        // 将封面裁剪过后的图片输出为一个文件对象
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob);
            console.log("🚀 ~ file: art_pub.js ~ line 91 ~ .toBlob ~ blob", blob)

            // 发起请求
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                // 传入formData类型的数据 必须要添加以下两个配置项
                contentType: false,
                processData: false,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('发布文章失败', {icon: 5, time: 800});
                    }

                    layer.msg('发布文章成功', {icon: 1, time: 800});
                    // 跳转到文章列表页面
                    location.href = './art_list.html'
                }
            });
        })
    });
});