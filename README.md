## 爬取All IT eBooks 图书资源
鉴于不要给AllITeBooks网站带来太大的流量压力，搜索的输入应该尽可能详细，减到爬取得无用的结果。
我也争取能把整个网站pdf文件爬取出来，然后放到百度云上
### 1.安装
    git clone https://github.com/wangzhengya/allitebooks.git
    cd allitebooks
    npm install
### 2.搜索关键词
    npm start
    得到一个以pdf.txt结尾的文本，里面含有下载pdf的链接，复制到迅雷中下载即可
### 3.按照分类爬取链接
    node index2.js
    得到一个以pdf.txt文本，里面含有下载pdf的链接，复制到迅雷中下载即可
### 4.爬取所有pdf文件
    node index3.js
    得到一个以pdf.txt文本，里面含有下载pdf的链接，复制到迅雷中下载即可