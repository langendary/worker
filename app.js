var express = require('express'); //引入express
var path = require('path');//引入path
// var favicon = require('serve-favicon');//引入appicon
// var logger = require('morgan');//引入报错日志
var session=require('express-session');
var cookieParser = require('cookie-parser');//引入cookie
var bodyParser = require('body-parser');//引入post方式模块
var ejs=require('ejs');//引入模板引擎
var index = require('./routes/index');//引入自定义路由主页js
var admin = require('./routes/admin');//引入自定义路由用户js
var app = express();//启动express
// view engine setup
var http=require('http').Server(app);
var io=require('socket.io')(http)
var userObj={},userArr=[],messages=[]; //在线人数socket对象,在线人数用户名数组
io.on('connection', function(socket){ //建立socket链接
    socket.on('getcontent',function (res) { //获取消息队列
        var con=[];
        messages.forEach(function (i) {
            if(i.recid===res){
                con.push(i);
                delete i;
            }
            socket.emit('getcon',con)
        })
    })
    socket.on('chat message', function(res){   //监听有人发消息事件
            messages.push(res)
            if(userObj[res.recid]){
                userObj[res.recid].emit('receive private message',res);
            }
    });
    socket.on('new',function (user){//有新用户登陆
        if(user.user in userObj){
            return;
        }
        socket.username=user.user;
        userObj[user.user]=socket;
        userArr.push(user.user);
        socket.emit('login',userArr,userArr.length);
        socket.broadcast.emit('logined',user.user,userArr,userArr.length);
    })
    socket.on('disconnect', function (){
        if(socket.username in userObj){
            delete(userObj[socket.username]);
            userArr.splice(userArr.indexOf(socket.username), 1);
        }
        socket.broadcast.emit('user left',socket.username,userArr);
    });
});
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));
app.set('views', path.join(__dirname, 'views'));//定义视图模板文件夹路径
app.set('view engine', 'ejs');//定义模板引擎
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());//转化json格式
app.use(bodyParser.urlencoded({ extended: false }));//post异步
app.use(express.static(path.join(__dirname, 'public')));//定义公共默认路径
// app.use(cookieParser("66666"));//启动cookie
// app.get('/login',function (req,res){
    // req.session.age=12;
    // res.cookie('name', '111', { signed: true });
//     res.render('login')
// });
// app.use(function (req,res,next){
    // if(req.signedCookies.name!='111'){
    //   res.redirect('/login');跳转页
    //     res.end()
    // }else {
    //   next()
    // }
//     if(req.session.age!=12){
//         res.redirect('/login');
//     }else {
//         next();
//     }
// });
app.use('/',index);//设置前台js文件的路径
app.use('/admin',admin);//设置后台js文件的路径

http.listen(8080);
module.exports = http