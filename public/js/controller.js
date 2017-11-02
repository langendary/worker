/**
 * Created by Administrator on 2017/5/6.
 */
angular.module("Controllers",[]).controller("index",["$scope","$http",function ($scope,$http) {
    $http({url:"/indexc"}).then(function (data){
        $scope.data=data.data;
        for(var i=0;i<$scope.data.length;i++){
            if($scope.data[i].uimg==""){
                $scope.data[i].uimg="../imgs/3.jpg"
            }
        }
    });
    var swiper = new Swiper('.swiper-container',{
        pagination: '.swiper-pagination',
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true
        }
    });
    // 监听tap事件，解决 a标签 不能跳转页面问题
    $scope.active="s";
    $scope.change=function(name){
        $scope.active=name;
    };
    mui('body').on('tap','a',function(){
        document.location.href=this.href
    });
    options = {
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: true, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    };
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    var w=$(".mm").width()
    $(".mm").css("left",-w);
    mui("body").on("drag",".mm",function (e) {
        var left=parseInt(e.detail.deltaX);
        if(e.detail.direction=="left"){
            $(this).css("left",left);
        }else if(e.detail.direction=="right"){
            console.log(left)
            if(left>0){
                left=0
            }
            $(this).css("left",left);
        }
    });
    mui("body").on("dragend",".mm",function (e) {
        var left=$(this).width();
        $(this).css("left",-left);
    });
    mui('body').on('tap','#me',function(){
       $(".mm").css("left",0)
    });

}]).controller("cons",["$scope","$http",function ($scope,$http){
    $scope.active="t";
    $scope.search="";
    $http({url:"/telphone"}).then(function (data){
            $scope.data=data.data;
    });
    $scope.messages=function (id,name) {
        location.href= `#!/messages/${id}`;
    }
}]).controller("messages",["$scope","$http","$location",function ($scope,$http,$location){
       console.log($location)
}]).controller("content",["$scope","$http",function ($scope,$http) {
    $scope.change=function(name){
        $scope.active=name;
    };
    $scope.back=function (){
        history.go(-1);
        $scope.active="x";
    };
    $http({url:"/telphone"}).then(function (data) {
        $scope.data=data.data;
    })
}]).controller("set",["$scope","$http",function ($scope,$http) {
    $scope.active="sz";
    $scope.change=function(name){
        $scope.active=name;
    };
    $scope.back=function () {
        history.go(-1);
        $scope.active="sz";
    };
}]).controller("grzx",["$scope","$http",function ($scope,$http) {
   $http({url:'/xinxi'}).then(function (data){
           $scope.data=data.data;
           $scope.j=$scope.data.j.length;
           $scope.f=$scope.data.f.length;
           $scope.yd=$scope.data.yd.length;
           $scope.jj=$scope.data.j;
           $scope.ff=$scope.data.f;
           $scope.ydc=$scope.data.yd;
           $scope.imageSrc=$scope.data.uimg;
   });
    $scope.grjj=localStorage.grjj?localStorage.grjj:"座右铭：之所以努力的原因是不想让未来的自己讨厌现在的自己";
    $scope.$watch("grjj",function (newv,oldv) {
        localStorage.grjj=$scope.grjj
    });
    $scope.back=function () {
        history.go(-1);
        $scope.active="s";
    };
    function getObjectURL(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    }
    var dir=document.querySelector("#ffs");
        dir.onchange=function(){
        var objUrl;
        if(navigator.userAgent.indexOf("MSIE")>0){
            objUrl = this.value;
        }else {
            objUrl = getObjectURL(this.files[0]);
        }
        document.querySelector("#img").setAttribute("src",objUrl);
        $("#sss").submit();
    } ;
    var currentLeft=0;
    mui("body").on("dragstart",".mui-collapse-content",function(e){
         $(".mui-collapse-content").css("left",0);
        currentLeft= parseInt($(this).css("left"))?parseInt($(this).css("left")):0;
    });
    mui("body").on("drag",".mui-collapse-content",function(e){
        if(e.detail.direction=="left"){
            var left=parseInt(currentLeft+e.detail.deltaX);
            if(left<-53){
                left=-53
            }
            $(this).css("left",left);
        }else if(e.detail.direction=="right"){
            var left=parseInt(currentLeft+e.detail.deltaX);
            if(left>0){
                left=0
            }
            $(this).css("left",left);
        }
    })
    $scope.del=function (cid){
        $http({url:"/del",params:{cid:cid}}).then(function(data){
            if(data.data=="1"){
                var len=$("#"+cid).siblings("a").find("span").text()
                $("#"+cid).siblings("a").find("span").text(parseInt(len)-1)
                $("#"+cid).remove()
            }
        });
    }
}]).controller("show",["$scope","$http","$routeParams",function ($scope,$http,$routeParams) {
     var id=$routeParams.id;
    $http({url:"/show",params:{id:id}}).then(function (data){
        $scope.data=data.data.info;
        $scope.time=$scope.data.ctime.substr(0,9);
        $scope.title=$scope.data.ctitle;
        $scope.con=$scope.data.con;
        $scope.name=data.data.uname;
    });
    $scope.back=function () {
        history.go(-1);
        $scope.active="x";
    };

}]);