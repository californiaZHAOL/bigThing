$(function(){
    // 点击 去注册账号
    console.log($('a#aL'));
    $('a#aL').click(() => {
        console.log($(this));
        $(this).toggleClass('hidden');
        $('a#aR').toggleClass('hidden');
    });

    // 点击 去登录
    $('a#aR').click(() => {
        $(this).toggleClass('hidden');
        $('a#aL').toggleClass('hidden');
    });
});