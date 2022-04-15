$(function(){
    // 请求参数对象
    let p = {
        // 页码值
        pagenum: 1,
        // 每页显示的数据条数
        pagesize: 5,
        // 文章分类的数据
        cate_id: '',
        // 文章的发布状态
        state: ''
    };

    let layer = layui.layer;
    let form = layui.form;

    // 获取文章列表数据的方法
    function initTable(){
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: p,
            success: function(res){
                if(res.status !== 0){
                    // 请求失败
                    return layer.msg('获取文章列表失败', {icon: 5, time: 800});
                }
    
                // 请求成功 开始渲染

                // 如果数据条数为0
                if(res.data.length === 0){
                    layer.msg('文章列表为空', {icon: 2, time: 800});
                }
                else{
                    layer.msg('获取文章列表成功', {icon: 1, time: 800});
                }
                
                $('tbody').html(
                    res.data.map(item => {
                        // {
                        //     "Id": 1,
                        //     "title": "abab",
                        //     "pub_date": "2020-01-03 12:19:57.690",
                        //     "state": "已发布",
                        //     "cate_name": "最新"
                        // }
                        return `
                        <tr>
                            <td>${item.title}</td>
                            <td>${item.cate_name}</td>
                            <td>${item.pub_date.split('.')[0]}</td>
                            <td>${item.state}</td>
                            <td>
                                <button type="button" class="layui-btn layui-btn-xs btnModeify" data-id=${item.Id}>编辑</button>
                                <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btnDelete" data-id=${item.Id}>删除</button>
                            </td>
                        </tr>
                        `;
                    }).join('')
                );

                // 渲染分页
                renderPage(res.total);
            }
        });
    }

    initTable();

    // 获取文章分类的列表
    function initList(){
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg("获取文章分类失败", {icon: 5, time: 800});
                }
                // 渲染
                let data = res.data;
                let html = `<option value="">所有分类</option>` + data.map((item => {
                    // {Id: 1, name: '最新', alias: 'Latest', is_delete: 0}
                    return `<option value="${item.Id}">${item.name}</option>`;
                })).join('');

                // 添加
                $('[name=cate_id]').html(html);

                // 用layui重新渲染表单区域
                form.render();
            }
        });
    }

    initList();

    // 监听筛选区域表单的提交事件
    $('.chooseForm').on('submit', function(event){
        // 阻止默认提交行为
        event.preventDefault();

        // 获取表单中选中项的值并赋值给查询参数
        p.cate_id = $('[name=cate_id]').val();
        p.state = $('[name=state]').val();

        // 重新渲染
        initTable();
    });

    // 渲染分页的方法
    function renderPage(total){
        // total为总数据条数

        let laypage = layui.laypage;
        //执行一个laypage实例 这个实例会帮助渲染一个分页盒子
        laypage.render({
            //注意，这里的 pageBox 是 ID，不用加 # 号
            elem: 'pageBox',
            //数据总数，从服务端得到
            count: total,
            // 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数
            limit: p.pagesize,
            // 起始页
            curr: p.pagenum,
            // layout指定分页中额外的功能
            // 功能项的前后顺序决定在页面中的顺序
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // *条/页
            limits: [2, 3, 5, 10],
            // 分页触发时的回调 切换条目时也会触发
            jump: function(obj, first){
                //obj包含了当 前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                
                //首次不执行
                if(!first){
                    //改变p参数的值
                    p.pagenum = obj.curr;
                    p.pagesize = obj.limit;
                    // 渲染列表
                    initTable();
                }
            }
        });
    }

    // 通过代理的形式为btnDelete删除按钮绑定点击事件
    $('tbody').on('click', '.btnDelete', function(){
        let id = $(this).attr('data-id');
        // 弹出层
        layer.confirm('是否确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg("删除文章失败", {icon: 5, time: 800});
                    }

                    // 删除成功

                    // 判断当前页是否还有剩余的数据
                    // 如果没有剩余的数据 让页面值减一
                    if($('.btnDelete').length <= 1){
                        p.pagenum--;
                        if(p.pagenum <= 0){
                            p.pagenum = 0;
                        }
                    }

                    // 重新渲染
                    initTable();
                    layer.msg("删除文章成功", {icon: 1, time: 800});
                }
            });
            layer.close(index); 
        });
    });

        // 通过代理的形式为btnModeify编辑按钮绑定点击事件
        $('tbody').on('click', '.btnModeify', function(){
            let id = $(this).attr('data-id');
            // 把id挂载到父页面的window对象上 方便编辑页面渲染
            window.parent.articleId = id;
            // 调转到编辑页面
            location.href = './art_edit.html';
        });
});