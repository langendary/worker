var express = require('express'); //引入express
var path = require('path');//引入path
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
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

// catch 404 and forward to error handler
// app.use(function(req, res, next){
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.listen(8080);
module.exports = app