var express = require('express');
var router = express.Router();
var con=require('../mysql.js');
var md5=require('../public/js/md5.js');
function admincheck(req,res,next){
    if(!req.session.adminuser){
        res.redirect('admin/login');//使用redirect必须有对应接受其的get
        res.end();
    }else{
       next();
    }
}                            //1.后台地址先输入localhst:8888/admin对应第一条get
                                //2.没有session请求/login进入登录页
                                  //3.登录页面中的地址/admin/checkadmin会提交到/checkadmin
                                  //4.在检测函数中的redirect发送admin/admina请求
/* GET users listing. */
router.get('/',admincheck,function(req, res, next){//app.js中设置了use(/admin,admin)这个地方的/代表根目录/admin，前台中的/代表根目录views
    res.render('admin/admin');
});
router.get('/login',function(req, res, next){//设置请求路径/login
    res.render('admin/login',{info:""});//admin根文件夹下的login.ejs，render根目录也是views
});
router.get('/admina',function(req, res, next){//app.js中设置了use(/admin,admin)这个地方的/代表根目录admin，前台中的/代表根目录views
    res.render('admin/admin',{user:req.session.adminuser.user});
});
router.get('/adduser',function (req,res,next){
    res.render("admin/adduser")
});
router.get('/checkadmin',function (req,res){
    var user=req.query.user;
    var upass=md5(req.query.upass);
    con.query("select * from user",function (err,result){
        if(!err){
            for (var i = 0; i < result.length;i++){
                if (result[i]['user'] == user){
                    if (result[i]['upass'] == upass){
                        if(result[i]['uroot']==0){
                            var ss={};
                            ss.user = user;
                            ss.uid=result[i].uid;
                            ss.uroot=0;
                            req.session.adminuser=ss;
                            res.redirect('/admin/admina');//跳转“/(admin文件)下的admin.ejs页”
                            res.end();
                            break;
                        }else{
                            res.render('admin/login',{info:"该账户没有管理员权限"});
                            break;
                        }
                    }else{
                        res.render('admin/login',{info:"账户或密码错误"});
                        break;
                    }
                }else{
                    res.render('admin/login',{info:"账户或密码错误"});
                    break;
                }
            }
        }
    });
});
router.get('/qrtj',admincheck,function (req,res,next){
    var user=req.query.user;
    var uname=req.query.uname;
    var uphone=req.query.uphone;
    var uemail=req.query.uemail;
    var ubumen=req.query.ubumen;
    var upass=md5(req.query.upass);
    con.query(`insert into user (user,upass,uname,uphone,uemail,ubumen) values ('${user}','${upass}','${uname}','${uphone}','${uemail}','${ubumen}')`,function (err,result) {
        console.log(err)
        if(result.affectedRows>0){
            res.end();
        }else{
            res.end();
        }
    })
});

module.exports = router;
