const http = require('http');
const httpProxy = require('http-proxy');
const auth = require('basic-auth');

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({changeOrigin: true, autoRewrite: true, hostRewrite: true, followRedirects: true});


const server = http.createServer(function(req, res) {

  // load from ENVs
//   const origin = process.env.ORIGIN;
//   const password = process.env.PASSWORD;
//   const username = process.env.USERNAME;
  var origin = 'https://www.google.com';//默认值
  const password = '123456';//默认密码
  var username = 'admin';//用户名是网址
  
  
  const credentials = auth(req);
  if((typeof credentials != 'undefined') && (credentials.name.indexOf('://')!= -1) ) {
    origin = credentials.name;//如果输入了网址则变更
    console.log('目标变更:',origin);
  }
    
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
    
    // console.log('Updated [proxy] response', JSON.stringify(proxyRes.headers, true, 2));
    
  });
  proxy.web(req, res, { target: `${origin}` });
  
});

const port = process.env.AWS_LAMBDA_RUNTIME_API.split(':')[1];
console.log(`simple-basic-http-auth-proxy for Vercel started on port ${port}`);
server.listen(port);


const isAuthed = function (credentials, username, password) {
    //return credentials.name === username && credentials.pass === password;
  return credentials.pass === password;
}
