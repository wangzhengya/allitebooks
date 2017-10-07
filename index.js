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
inquirer.prompt([{
    type: 'input',
    name: 'word',
    message: '您要找的关键词：'
  }]).then(function (answers) {
	topic = answers.word;
    console.log("你要寻找关于"+topic+"的文件");

    var url = "http://www.allitebooks.com/page/1/?s="+topic ;
    fetchPage(url);//抓取所有
    //startRequest(url);//抓取首页，测试用
});



function fetchPage(x) {     //封装了一层函数
    http.get(x, function (res) {
        var html = '';        //用来存储请求网页的整个html内容
        var titles = [];        
        res.setEncoding('utf-8'); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on('data', function (chunk) {   
            html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {

            var $ = cheerio.load(html); //采用cheerio模块解析html
            
            if( $('span.extend').next().text().trim()){
                numOfPages = $('span.extend').next().text().trim();
            }
            
            console.log("总共"+numOfPages+"页");
            
        for(let i =1 ; i<=numOfPages; i++){
            startRequest("http://www.allitebooks.com/page/"+i+"/?s="+topic); 
        }

        }).on('error', function (err) {
            console.log(err);
        });
    });

}

function startRequest(x) {//采用http模块向服务器发起一次get请求 
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
                        fs.appendFile('./'+topic+'pdf.txt', bookDOM+"\n",function(err){
                            if(err) console.log('写文件操作失败');
                            else console.log('写文件操作成功');
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


