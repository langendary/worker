var express = require('express');
var router = express.Router();
var con=require('../mysql.js');
var md5=require('../public/js/md5');
var path=require("path");
var formidable=require("formidable");
var fs=require("fs");
/* GET home page. */
function check(req,res,next){
    if(!req.session.user){
        res.redirect('/login');
        res.end();
    }else{
        next();
    }
}
router.get('/',check,function(req,res,next){
    res.render('index',{userInfo:JSON.stringify(req.session.user)});
});
router.get('/yindao',function (req,res,next){
    res.render('yindao');
});
router.get('/login',function (req,res){
    req.session.user=null;
    res.render('login',{info:""});
});
router.get("/indexc",function (req,res){
    var limitid=req.query.cid?req.query.cid:0;
    con.query(`select cid,con,ctitle,uimg from cons,user where cons.fid=user.uid order by cid desc`,function (err,result){
        res.send(JSON.stringify(result))
   })
});
router.get('/checklogin',function (req,res){
     var user=req.query.user;
     var upass=md5(req.query.upass);
         con.query("select * from user",function (err,result){
             if(!err){
                 for (var i = 0;i < result.length;i++){
                     if (result[i]['user'] == user){
                         if (result[i]['upass']== upass){
                             var s = {};
                             s.user = user;
                             s.uphone=result[i]['uphone'];
                             s.uemail=result[i]['uemail'];
                             s.login = "yes";
                             s.uid=result[i]['uid'];
                             s.uimg=result[i]["uimg"]?result[i]["uimg"]:"../imgs/3.jpg";
                             req.session.user=s;
                             res.redirect('/');
                             res.end();
                             break;
                         }else{
                             res.render('login',{info:"账户或密码错误"});
                         }
                     }else{
                         continue;
                         res.render('login',{info:"账户或密码错误"});
                     }
                 }
             }else{
                 console.log(err)
             }
         });
    });
router.get('/telphone',check,function (req,res){
    var u=req.query.username;
    con.query(`select * from user where user!='${u}'`,function (err,result){
           res.send(JSON.stringify(result));
    })
});
router.get('/clearsession',check,function (req,res){
    req.session.user=null;
    res.render('login',{info:"退出成功"})
});
router.get('/editinfo',check,function (req,res){
    var id=req.session.user.uid;
    var uphone=req.session.user.uphone;
    var uemail=req.session.user.uemail;
    var newpass=md5(req.query.upass?req.query.upass:id);
    var newemail=req.query.uemail?req.query.uemail:uemail;
    var newphone=req.query.upass?req.query.uphone:uphone;
    con.query(`update user set upass='${newpass}',uphone='${newphone}',uemail='${newemail}' where uid='${id}'`,function (error,result) {
        if(result.affectedRows>0){
            res.render('login',{info:"修改成功，请重新登录"})
        }
    })
});
router.post('/contents',check,function (req,res){
    var fid=req.session.user.uid;
    var jid=req.body.select;//收件人id
    var conss=req.body.con;
    var ctitle=req.body.ctitle;
    con.query(`insert into cons (jid,fid,con,ctitle) values ('${jid}','${fid}','${conss}','${ctitle}')`,function (err,result) {
        if(result.affectedRows>0){
           res.render("index",{info:"发送成功"})
        }
    })
});
router.get('/xinxi',check,function (req,res){
    var id=req.session.user.uid;
    var arr={};
    arr.uimg=req.session.user.uimg;
    con.query(`select * from cons where fid='${id}'`,function (err,result){
        arr.f=result;
          con.query(`select * from cons where jid=${id} and cstate=0`,function (err,result1){
              arr.j=result1;
              con.query(`select * from cons where jid=${id} and cstate=1`,function (err,result2){
                  arr.yd=result2;
                  res.send(JSON.stringify(arr))
              });
          });
    });
});
router.post('/upload',function (req,res){
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    var dang=path.resolve(__dirname, '../');
    form.uploadDir = path.join(dang+'/public/imgs/upload/');     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 20 * 1024 * 1024;   //文件大小
    form.parse(req, function(err,fields,files) {
        if (err) {
            res.locals.error = err;
            res.render('index');
            return;
        }
        var extName = '';  //后缀名
        switch (files.fulAvatar.type) {
            case 'imagepeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index');
            return;
        }
        var avatarName = Math.random() + '.' + extName;
        var newPath =form.uploadDir + avatarName;
        fs.renameSync(files.fulAvatar.path,newPath);  //重命名
        var uid=req.session.user.uid;
        var newUrl="/imgs/upload/"+avatarName;
        con.query(`update user set uimg='${newUrl}' where uid=${uid}`,function (err,result) {
                   if(result.affectedRows>0){
                       req.session.user.uimg=newUrl;
                       res.render("index")
                   }else{
                       console.log(err);
                       res.end();
                   }
        });
    });
    // res.end();
});
router.get("/del",check,function (req,res) {
    var cid=req.query.cid;
    con.query(`delete from cons where cid=${cid}`,function (err,result) {
        if(result.affectedRows>0){
            res.send("1")
        }else{
            console.log(err)
            res.end();
        }
    });
})
router.get('/show',check,function (req,res){
    var cid=req.query.id;
    var uid=req.session.user.uid;
    var obj={};
    con.query(`select * from user,cons where cid='${cid}' and uid='${uid}'`,function (err,result){
        var fid=result[0]['fid'];
        obj.info=result[0];
        con.query(`select uname from user where uid=${fid}`,function (err,result1) {
            obj.uname=result1[0].uname;
            con.query(`update cons set cstate='1' where cid=${cid}`);
            res.send(JSON.stringify(obj));
        });
    });
});
router.get("/editstate",check,function (req,res) {
       var cid=req.query.id;
       con.query(`update cons set cstate='1' where cid=${cid}`)
});
module.exports = router;
