var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var inquirer = require('inquirer');

var booksPage = [];
var books = [];
var numOfPages = 1;
var topic = "";
var inquirer = require('inquirer');


    fetchPage();//抓取所有
    //startRequest(url);//抓取首页，测试用

function fetchPage() {     //封装了一层函数
    for(let i=1;i<=732;i++){
        var oneSecond = 10000 * i; // 防止反爬虫，每十秒一页
        setTimeout(function() {
            console.log("==============="+i+"=============");
            console.log("http://www.allitebooks.com/page/"+i+"/");
            startRequest("http://www.allitebooks.com/page/"+i+"/");
        }, oneSecond);
    }

}

function startRequest(x) {//采用http模块向服务器发起一次get请求 
    console.log("抓取"+x);
    http.get(x, function (res) {//爬取目录中每本书地址
        var html = '';        //用来存储请求网页的整个html内容
        var titles = [];        
        res.setEncoding('utf-8'); //防止中文乱码
     //监听data事件，每次取一块数据
        res.on('data', function (chunk) {   
            html += chunk;
        });
     //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {
        console.log("页面");
         var $ = cheerio.load(html); //采用cheerio模块解析html
         
         var booksDOM = $('h2.entry-title a');
         for(let i =0 ;i<10; i++){
             if(booksDOM[i]){
                booksPage.push({
                    link:booksDOM[i].attribs.href,
                    title:booksDOM[i].children[0].data,
                });
                http.get(booksDOM[i].attribs.href, function (res) {//爬取每本书的下载地址
                    var html = '';        
                    var titles = [];        
                    res.setEncoding('utf-8');
                    res.on('data', function (chunk) {   
                        html += chunk;
                    });
                    res.on('end', function () {

                    var $ = cheerio.load(html); //采用cheerio模块解析html
                    if($('i.fa-download').parent()[0]){
                        var bookDOM = $('i.fa-download').parent()[0].attribs.href;
                        console.log(bookDOM);
                        fs.appendFile('pdf.txt', bookDOM+"\n",function(err){
                            if(err) console.log('写文件操作失败');
                        });
                    }
                    
                    }).on('error', function (err) {
                        console.log(err);
                    });
                });
            }
         }
         //console.log(booksPage);
        }).on('error', function (err) {
            console.log(err);
        });
    });
}


