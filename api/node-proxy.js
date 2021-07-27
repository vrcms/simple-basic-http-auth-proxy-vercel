const http = require('http');
const cheerio = require('cheerio');
const { ungzip } = require('node-gzip');

const fs = require("fs")
const url = require("url")
const path = require("path")

const httpProxy = require('http-proxy');
const auth = require('basic-auth');
var Cookies = require('cookies');
//cookies进行签名(加密)
var keys = ['keyboard cat'];

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({changeOrigin: true, autoRewrite: true, hostRewrite: true, followRedirects: true,secure: false});
//const normalwebsite = 'https://www.baidu.com';//默认值
//const defaulturl = 'https://www.google.com';// a default target
var origin ;//默认值



const server = http.createServer(function(req, res) {

  // load from ENVs
//   const origin = process.env.ORIGIN;
//   const password = process.env.PASSWORD;
//   const username = process.env.USERNAME;
  
  const password = '123456';//默认密码
  const username = 'admin';//用户名
  
  
  const credentials = auth(req);
  
    
  if (!credentials || !isAuthed(credentials, username, password)) {

      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="example"');
      res.end('Access denied. error password!');
    
  } else {
    // do nothing
    // res.end('Access granted')
  }


  proxy.on('proxyRes', function(proxyRes, req, res) {
    //console.log('Raw [target] response', JSON.stringify(proxyRes.body, true, 2));
    
    proxyRes.headers['x-proxy'] = "simple-basic-http-auth-proxy-vercel";
        
    proxyRes.headers['x-proxy-domain'] = origin;
    
    //inject js file
    //console.log(`Proxy response with status code: ${proxyRes.statusCode} to url ${req.url}`);
    if (proxyRes.statusCode == 301) {
        throw new Error('You should probably do something here, I think there may be an httpProxy option to handle redirects');
    }
    let body = [];
    proxyRes.on('data', function (chunk) {
        body.push(chunk);
    });
    proxyRes.on('end', async function () {
        let buffer = Buffer.concat(body);
        try {
            let $ = null;
            const isCompressed = proxyRes.headers['content-encoding'] === 'gzip';
            const decompressed = isCompressed ? await ungzip(buffer) : buffer;
            const scriptTag = '<script>alert("is a:'+req.url+'")</script>';
            $ = cheerio.load(decompressed.toString());
            $('body').append(scriptTag);
            res.end($.html());
        } catch (e) {
            console.log(e);
        }
    });
    
    //end
    
    
    
    
  });
  
  //创建cookie对象
  var cookies = new Cookies(req, res, { keys: keys });
  if(req && req.url.substring(0,3).toUpperCase() == '/F/'){
    //更改目标
     var targeturl = '';//默认url
     var inurl = req.url.substring(3);
     
    if(inurl.substring(0,4).toUpperCase() == 'HTTP' ) {      
      //把丢失的/找回来
      inurl = inurl.replace('https:/','https://');
      inurl = inurl.replace('http:/','http://');
      targeturl = inurl;
      
    }
     cookies.set('lastorigin', targeturl, { signed: true,maxAge:0 }); //永久有效 
     res.statusCode = 200;
      
      res.end('<!DOCTYPE html><html><head><script language="javascript" type="text/javascript">window.location.href="/";</script></head>cookie changed!</html>');
    return;
  }
  
  if(req && req.url.substring(0,3).toUpperCase() == '/C/'){
      //origin = normalwebsite;//默认值  
      cookies.set('lastorigin', '', { signed: true,maxAge:0 }); //删除 
      res.statusCode = 200;      
      res.end('<!DOCTYPE html><html><head><script language="javascript" type="text/javascript">window.location.href="/";</script></head>cookie clean!</html>');
      return;
  }
  
  var lastorigin = cookies.get('lastorigin', { signed: true });
    
  if(lastorigin && (lastorigin.indexOf('://') != -1)){
     //console.log('show target........'+lastorigin); 
     origin = lastorigin
  } 
 
  if(typeof lastorigin == 'undefined' || lastorigin==''){
    //origin = normalwebsite;//默认值
    
     console.log('show index.....'); 
     res.statusCode = 200;      
      const filePath = path.join(__dirname, 'g.dabeizi.com.html')
    fs.readFile(filePath, "binary", (err, file) => {
        if (err) {
            res.writeHead(404, "not found")
            res.end("<h1>404 NOT FOUND"+filePath+"</h1>")
        } else {
            res.write(file, "binary")
            res.end()
        }
    })
      
    
  }else{
    proxy.web(req, res, { target: `${origin}`,selfHandleResponse: true });
  }
    
  
  
});


server.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    res.end('Something went wrong.');
});


const port = process.env.AWS_LAMBDA_RUNTIME_API.split(':')[1];
console.log(`simple-basic-http-auth-proxy for Vercel started on port ${port}`);
server.listen(port);


const isAuthed = function (credentials, username, password) {
    return credentials.name === username && credentials.pass === password;
  
}
