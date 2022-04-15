$(function(){
    // 获取文章分类的列表
    function initList(){
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res){
                // 渲染
                render(res.data);
            }
        });
    }

    function render(data){
        let html = data.map(((item, index) => {
            // {Id: 1, name: '最新', alias: 'Latest', is_delete: 0}
            if(item.is_delete){
                return '';
            }

            // 文章类别未删除
            return `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.alias}</td>
                <td>
                    <button type="button" class="layui-btn layui-btn-xs btnModeify" data-id=${item.Id}>修改</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btnDelete" data-id=${item.Id}>删除</button>
                </td>
            </tr>
            `
        })).join('');

        $('tbody').html(html);
    }

    initList();

    let layer = layui.layer;
    // 弹出层的返回值
    let index = 0;
    // 为添加内别按钮绑定点击事件
    $('#add').click(function(){
        index = layer.open({
            title: '添加文章分类',
            content: `
            <form class="layui-form addForm" action="">
                <div class="layui-form-item">
                    <label class="layui-form-label">分类名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">分类别名</label>
                    <div class="layui-input-block">
                        <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                    </div>
                </div>
            </form>
            `,
            type: 1,
            area: ['520px', '250px']
        });
    });

    // 通过代理的形式，为添加的表单绑定提交事件
    $('body').on('submit', '.addForm', function(event){
        event.preventDefault();
         $.ajax({
             type: 'POST',
             url: '/my/article/addcates',
             data: $(this).serialize(),
             success: function(res){
                 if(res.status !== 0){
                     return layer.msg('新增分类失败', {icon: 5, time: 800});
                 }

                //  重新刷新
                initList();
                // 自动关闭弹出层
                layer.close(index);
                layer.msg('新增分类成功', {icon: 1, time: 800});
             } 
         });
    });

    let form = layui.form;
    // 修改文章分类按钮点击事件
    // 也要通过代理的形式，因为表格是动态添加的
    $('tbody').on('click', '.btnModeify', function(){
        // 弹出层
        index = layer.open({
            title: '修改文章分类',
            content: `
            <form class="layui-form editForm" action="" lay-filter="editForm" >
                <div class="layui-form-item">
                    <label class="layui-form-label">分类名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label">分类别名</label>
                    <div class="layui-input-block">
                        <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn" lay-submit lay-filter="formDemo">确认修改</button>
                    </div>
                </div>

                <input type="hidden" name="Id"">
            </form>
            `,
            type: 1,
            area: ['520px', '250px']
        });

        // 给弹出层的表单填值
        let data = {
            name: $(this).parent().parent().find('td:nth-child(2)').html(),
            alias: $(this).parent().parent().find('td:nth-child(3)').html(),
            // 给隐藏域的input赋值id属性，方便更改文章类别数据
            Id: $(this).attr('data-id')
        };
        form.val('editForm', data);
    });

    // 为确认修改表单添加代理
    // 通过代理的形式，为添加的表单绑定提交事件
    $('body').on('submit', '.editForm', function(event){
        event.preventDefault();
         $.ajax({
             type: 'POST',
             url: '/my/article/updatecate',
             data: $(this).serialize(),
             success: function(res){
                 if(res.status !== 0){
                     return layer.msg('修改分类失败', {icon: 5, time: 800});
                 }

                //  重新刷新
                initList();
                // 自动关闭弹出层
                layer.close(index);
                layer.msg('修改分类成功', {icon: 1, time: 800});
             } 
         });
    });

    // 为删除按钮绑定点击事件
    $('tbody').on('click', '.btnDelete', function(){
        let id = $(this).attr('data-id');
        // 弹出confirm框
        layer.confirm(`确认删除分类'${$(this).parent().parent().find('td:nth-child(2)').html()}'吗？`, {icon: 3, title:'提示'}, function(index){
            // 确认删除
            $.ajax({
                type: 'GET',
                // 这里不能用$(this).attr('data-id')了，因为是在layer.confirm的回调里面
                // this可不是按钮
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败', {icon: 5, time: 800});
                    }
   
                   //  重新刷新
                   initList();
                   // 自动关闭弹出层
                   layer.close(index);
                   layer.msg('删除分类成功', {icon: 1, time: 800});
                } 
            });
            // 关闭确认框
            layer.close(index);
        });
    });
});