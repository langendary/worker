/**
 * Created by Administrator on 2017/5/6.
 */
var async=require('async');
// 串行   好处：不需要嵌套，可以一个接一个的往下执行
// async.series([
//     function (callback) {
//     setTimeout(function () {
//         console.log('买菜')
//         callback(null,"买菜")
//
//     },1000)
//     },
//     function (callback) {
//         setTimeout(function () {
//             console.log('做饭')
//             callback(null,"做饭")
//
//         },1000)
//     }
// ],function (err,result) {
//     console.log(result)
// })
// 并行
// async.parallel([
//     function (callback){
//         setTimeout(function () {
//             console.log('买菜')
//             callback(null,"买菜")
//         },1000)
//     },
//     function (callback) {
//         setTimeout(function () {
//             console.log('做饭')
//             callback(null,"做饭")
//
//         },1000)
//     }
// ],function (err,result) {
//     console.log(result)
// })
// 串行并行合并的用
// async.auto({
//     chuan:function (callback) {
//         setTimeout(function () {
//         console.log('买菜');
//         callback(null,"买菜");
//          },1000)
//     },
//     chuan1:function (callback) {
//         setTimeout(function () {
//             console.log('买肉');
//             callback(null,"买肉");
//         },2000)
//     },   //串行完成的瞬间会执行下面的并行函数
//     bingxing:["chuan","chuan1",function (results,callback){
//         console.log(results.chuan,results.chuan1);
//         callback(null,JSON.stringify(results))
//     }],
// },function (err,result) {
//     console.log(result)
// });
// 串行循环函数
var arr=[1,2,3,4];
async.eachSeries(arr,function (item,callback){
    setTimeout(function (){
        console.log(item);
        callback(null);
    },1000)
});