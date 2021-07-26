const http = require('http');

const fs = require("fs")
const url = require("url")
const path = require("path")

const httpProxy = require('http-proxy');
const auth = require('basic-auth');
var Cookies = require('cookies');
//cookies进行签名(加密)
var keys = ['keyboard cat'];

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({changeOrigin: true, autoRewrite: true, hostRewrite: true, followRedirects: true});
const normalwebsite = 'https://www.baidu.com';//默认值
const defaulturl = 'https://www.google.com';// a default target
var origin = normalwebsite;//默认值



const server = http.createServer(function(req, res) {

  // load from ENVs
//   const origin = process.env.ORIGIN;
//   const password = process.env.PASSWORD;
//   const username = process.env.USERNAME;
  
  const password = '123456';//默认密码
  const username = 'admin';//用户名是网址
  
  
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
     var targeturl = defaulturl;//默认url
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
  }
  
  if(req && req.url.substring(0,3).toUpperCase() == '/C/'){
      origin = normalwebsite;//默认值  
      cookies.set('lastorigin', '', { signed: true,maxAge:0 }); //删除 
      res.statusCode = 200;      
      res.end('<!DOCTYPE html><html><head><script language="javascript" type="text/javascript">window.location.href="/";</script></head>cookie clean!</html>');
  }
  
  var lastorigin = cookies.get('lastorigin', { signed: true });
    
  if(lastorigin && (lastorigin.indexOf('://') != -1)){
    origin = lastorigin
  } 
 
  if(typeof lastorigin == 'undefined' || lastorigin==''){
   //origin = normalwebsite;//默认值
      res.statusCode = 200;
      let indexhtml = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="https://web.cms.haodanku.com/favicon.ico">
	<link
	  rel="stylesheet"
	  href="https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css"
	/>
	
	
	<!-- 引入 Vue 和 Vant 的 JS 文件 -->
	<script src="https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/vant@2.12/lib/vant.min.js"></script>
	
	<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

	<script src="https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.min.js"></script>
	
	<style type="text/css">
		#topsearch{
			position: fixed;
			top: 0;
			width: 100%;
			height: 1250px;
			z-index: 1001;
			background: #f4f4f4;
			border-bottom: 1px solid #ccc;
			box-sizing: border-box;
		}
		
		#app.hastop .index .index-fixed .index-top{
			top:1250px!important;
		}
		
		#app.notop .index .index-fixed .index-top{
			top:0px!important;
		}
		
		
		#app{
			
		}
		#app.hastop{
			margin-top: 1250px!important;
		}
		
		#app.notop{
			margin-top:0px!important;
		}
		
		.van-dropdown-menu__bar{
			border: 1px dashed #eee;
			background-color:transparent!important;
			box-shadow:none!important;
			box-sizing: border-box;
			height: 34px!important;
		}
	</style>
</head>
<body>
	<div id="topsearch">
		
		<van-search
		  v-model="value"
		  show-action
		  label=""
		  placeholder="请输入域名"
		  @search="onSearch"
		>
		  <template #action>
		    <div @click="onSearch">确定</div>
		  </template>
		  
		  <template #left>
		    <van-dropdown-menu style="background-color: transparent;">
		      <van-dropdown-item v-model="protocol" :options="protocoloptions" />		      
		    </van-dropdown-menu>
		  </template>
		</van-search>
		
		


		<div style="height: 100px;margin-top: 10px;">
			<van-grid direction="horizontal" :icon-size="10"  :column-num="3">
			  <van-grid-item v-for="(item,index) in sitelist" :key="index" :url="item.url" >
				  <div style="color: #333;"  >
						<span style="padding:5px 5px;" @click.stop="removethis(index)">x</span>{{item.title}} 
				  </div>				  
			  </van-grid-item>
			</van-grid>
		</div>
		
		
		
		
	
	</div>
	
	
	
	
	
    <script>
        var vmCid = 'POU1XrWZ';
        var time_stamp = '?t=' + (Date.now() - Date.now() % (60 * 1000));
        var baselink = 'https://img.bc.haodanku.com/cms_web/cms_web.min.js' + time_stamp;
        document.write('<script src="' + baselink + '"><\/script>');
    </script>
	
	
	
	
	
	
	
	<script>
		
		function run_check(){
				  //console.log('select...',$("#app .van-tabbar-item"));
				  
				  if($("#app .van-tabbar-item:first").hasClass('van-tabbar-item--active')){
					  //console.log('第一烂尾');
					  $("#topsearch").show();
					  $("#app").removeClass('notop');
					  $("#app").addClass('hastop');					  
				  }else{
					  //console.log('第二篮网');
					  $("#topsearch").hide();
					  $("#app").addClass('notop');
					  $("#app").removeClass('hastop');
					 
				  }
				  
				 window.setTimeout('run_check()',200);		  
		}	 
		
		$(document).ready(function(){
				  run_check();
		});
				
		
		
	  // 在 #app 标签下渲染一个按钮组件
	  let myvue = new Vue({
	    el: '#topsearch',
		data(){
			return{
				sitelist:[],
				localurl:[],
				protocoloptions:[
					  { text: ' https ', value: 'https' },
					  { text: ' http ', value: 'http' },
				],
				protocol:'https',//默认协议
		    	message: '',
				value:'',//默认域名
			}
		  },
		mounted() {
			let defaulturl = [
				{title:'百度',url:'https://g.dabeizi.com/f/https://www.baidu.com'},
				{title:'首页',url:'https://g.dabeizi.com/c/'},
				
			];//默认值
			
			//本地缓存
			let locallist = localStorage.getItem('cachelist');
			console.log('当前==',locallist);
			if(!locallist) {
				locallist = [];
			}else{
				locallist = JSON.parse(locallist);
			}
			
			for (let i = 0; i < locallist.length; i++) {
				this.localurl.push(locallist[i].url);
			}
			
			//加入默认值
			for (let i = 0; i < defaulturl.length; i++) {
				if(this.localurl.includes(defaulturl[i].url)){					
				}else{
					//加入缓存
					locallist.unshift(defaulturl[i]);
				}	
			}
			
			this.sitelist = locallist;
			
				
				
		}, 
		methods:{
			removethis(index){
				this.sitelist.splice(index,1);
				localStorage.setItem('cachelist', JSON.stringify( this.sitelist ));
			},
			onSearch(){
				console.log('search.....');
				let newurl = {
					title:this.value,
					url:'https://g.dabeizi.com/f/'+this.protocol+'://'+this.value
				}
				
				this.sitelist.push(newurl);
				localStorage.setItem('cachelist', JSON.stringify( this.sitelist ));
				
			},
		},	  
	  });
	
	  // 调用函数组件，弹出一个 Toast
	  vant.Toast('加载完成');
	
	  // 通过 CDN 引入时不会自动注册 Lazyload 组件
	  // 可以通过下面的方式手动注册
	  Vue.use(vant.Lazyload);
	  
	 
	 
	</script>
	
</body>

</html>
      `;
    
      res.end(indexhtml);
      return;
  }
    
  proxy.web(req, res, { target: `${origin}` });
  
});

const port = process.env.AWS_LAMBDA_RUNTIME_API.split(':')[1];
console.log(`simple-basic-http-auth-proxy for Vercel started on port ${port}`);
server.listen(port);


const isAuthed = function (credentials, username, password) {
    return credentials.name === username && credentials.pass === password;
  
}
