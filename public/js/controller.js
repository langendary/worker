/**
 * Created by Administrator on 2017/5/6.
 */
angular.module("Controllers",["messageServer"]).controller("index",["$scope","$http","message","$rootScope",function ($scope,$http,message,$rootScope) {
    $http({url:"/indexc"}).then(function (data){
        $scope.data=data.data;
        for(var i=0;i<$scope.data.length;i++){
            if($scope.data[i].uimg==""){
                $scope.data[i].uimg="../imgs/3.jpg"
            }
        }
    });
    localStorage.userInfos=$("#hiden").val();
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
}]).controller("cons",["$scope","$http","message","$rootScope","$q",function ($scope,$http,message,$rootScope,$q){
    $scope.active="t";
    $scope.search="";
    $scope.data=[];
    message.emit('new',JSON.parse(localStorage.userInfos))//用户信息提交后台
    message.on('login',function (user,index){
        localStorage.nowLine=JSON.stringify(user); //自己获取在线用户
    });
    $http({url:"/telphone",params:{username:JSON.parse($("#hiden").val()).user}}).then(function (data){
        JSON.parse(localStorage.nowLine).forEach(function (t) {
            if(JSON.parse(localStorage.nowLine).length>0){
                data.data.forEach(function (t2) {
                    if(t2.user===t){
                        t2.line="在线";
                    }else if(t2.line!=="在线"){
                        t2.line="离线";
                    }
                })
            }
        })
        $scope.data=data.data;
    });
    message.on('logined',function (user,userArr,length){//有人登陆获取
        localStorage.nowLine=JSON.stringify(user)
        $scope.$apply(function (){
            $scope.data.forEach(function (t) {
                if(t.user===user){
                    t.line="在线";
                }else if(t.line!=="在线"){
                    t.line="离线";
                }
            })
        })
    })
    message.on('user left',function (user,userArr) {
        localStorage.nowLine=JSON.stringify(userArr)
        $scope.$apply(function (){
            $scope.data.forEach(function (t){
                if(t.user===user){
                    t.line="离线";
                }
            })
        })
    })
    $scope.messages=function (juser) {
        sessionStorage.userInfo=JSON.stringify(juser);
        location.href= `#!/messages/${juser.uid}`;
    }
}]).controller("messages",["$scope","$http","$location","message",function ($scope,$http,$location,message){
    var fuser=JSON.parse(localStorage.userInfos);//我的信息
    var juser=JSON.parse(sessionStorage.userInfo);//接收人信息
    message.emit('getcontent',fuser.user);
    message.on('getcon',function (res) {
        for(var i=0;i<res.length;i++){
        var str=`<li style="text-align:left"> 
                    <span class="recImg"><img src="${juser.uimg}" alt=""></span>
                    <span class="names">${juser.user}</span> 
                    <span class="times">${getTime()}</span></br> 
                    <div class="messages">${res[i].con}</div> 
                    </li>`
        contents.append(str)
        }
    });
    function Zero(s) {
        return s < 10 ? '0' + s: s;
    }
    function getTime() {
        var date=new Date(),
            h=date.getHours(),
            m=date.getMinutes(),
            s=date.getSeconds(),
            time;
       return time=Zero(h)+":"+Zero(m)+":"+Zero(s)
    }
    $scope.messages=[]
    var contents=$('#messages')
    $('#btn').click(function () {
        var val=$("#m").val();
        var option = {
            'myid': fuser.user, //我的id!!!!!!!!!!!!
            'recid': juser.user,  //接收人的id
            'type': 'plain',  //类型
            'con': val, //发送内容
        }
        if(val!==""){
            var str=`<li style="text-align: right"> 
                        <span class="recImg"><img src="${fuser.uimg}" alt=""></span>
                        <span class="names">${fuser.user}</span> 
                        <span class="times">${getTime()}</span></br> 
                        <div class="myMessages">${val}</div> 
                     </li>`
            contents.append(str);
            message.emit('chat message', option);
        }else{
            return;
        }
        $("#m").val('');
    });
    message.on('receive private message', function (res) {
        if(res.con){
                var str=`<li style="text-align: left"> 
                    <span class="recImg"><img src="${juser.uimg}" alt=""></span>
                    <span class="names">${juser.user}</span> 
                    <span class="times">${getTime()}</span></br> 
                    <div class="messages">${res.con}</div> 
                    </li>`
                contents.append(str)
        }
    })
    mui.init({
                    pullRefresh : {
                        container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                        down : {
                            height:50,//可选,默认50.触发下拉刷新拖动距离,
                            auto: false,//可选,默认false.首次加载自动下拉刷新一次
                            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                            callback :function () {

                            }    //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                        }
        }
    });
}]).controller("content",["$scope","$http",function ($scope,$http){
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
}]).controller("set",["$scope","$http","message",function ($scope,$http,message) {
    $scope.active="sz";
    $scope.change=function(name){
        $scope.active=name;
    };
    $scope.back=function () {
        history.go(-1);
        $scope.active="sz";
    };
    $scope.outlogin=function () {
        message.emit('disconnect',JSON.parse(localStorage.userInfos).user)
        location.href='/clearsession'
    }
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