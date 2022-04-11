$(function(){
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
});