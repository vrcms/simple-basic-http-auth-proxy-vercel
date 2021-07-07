const http = require('http');
const httpProxy = require('http-proxy');
const auth = require('basic-auth');

var Cookies = require('cookies');
//cookies进行签名(加密)
var keys = ['keyboard cat'];

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({changeOrigin: true, autoRewrite: true, hostRewrite: true, followRedirects: true});
const envORIGIN = process.env.ORIGIN;
var origin = (envORIGIN && envORIGIN != '') ? envORIGIN:'https://www.google.com';//默认值
var cacheorigin;


const server = http.createServer(function(req, res) {

  // load from ENVs
//   const origin = process.env.ORIGIN;
//   const password = process.env.PASSWORD;
//   const username = process.env.USERNAME;
  
  const password = '123456';//默认密码
  var username = 'admin';//用户名是网址
  
  
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
    // console.log('Raw [target] response', JSON.stringify(proxyRes.headers, true, 2));
    
    proxyRes.headers['x-proxy'] = "simple-basic-http-auth-proxy-vercel";
        
    proxyRes.headers['x-proxy-domain'] = origin;
    
    
  });
  
  //创建cookie对象
  var cookies = new Cookies(req, res, { keys: keys });
  if(req && req.url.substring(0,3).toUpperCase() == '/F/'){
    //更改目标
     var targeturl = 'https://www.google.com';//默认url
     var inurl = req.url.substring(3);
     console.log('目标:',inurl);
    if(inurl.indexOf('://') != -1 ) targeturl = inurl;
     cookies.set('lastorigin', targeturl, { signed: true,maxAge:0 }); //永久有效      
  }
  
  if(req && req.url.substring(0,3).toUpperCase() == '/C/'){
     cookies.set('lastorigin', '', { signed: true,maxAge:-1 }); //删除
     origin = (process.env.ORIGIN && process.env.ORIGIN!='') ?process.env.ORIGIN:'https://www.google.com';//默认值     
  }
  
  var lastorigin = cookies.get('lastorigin', { signed: true });
  console.log('65 lastcookie==',lastorigin);
  
  if(lastorigin && (lastorigin.indexOf('://') != -1)){
    origin = lastorigin
  } 
 
  if(typeof lastorigin == 'undefined'){
   origin = envORIGIN;//默认值
  }
    
  proxy.web(req, res, { target: `${origin}` });
  
});

const port = process.env.AWS_LAMBDA_RUNTIME_API.split(':')[1];
console.log(`simple-basic-http-auth-proxy for Vercel started on port ${port}`);
server.listen(port);


const isAuthed = function (credentials, username, password) {
    //return credentials.name === username && credentials.pass === password;
  return credentials.pass === password;
}
