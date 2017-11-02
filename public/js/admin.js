$(function(){
    $(".fu li").click(function(e){
        $(this).find(".son").toggle(200);
        if($(this).find(".son").css("height")=="1px"){
            $(this).children(".iconfont").css("transform","rotate(-135deg)");
        }else{
            $(this).children(".iconfont").css("transform","rotate(0deg)");
        }
    })
    $(".fu li .son a").click(function(e){
        e.stopPropagation();
    })
})
