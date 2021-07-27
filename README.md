# simple-proxy-with-auth

🔐▲ A simple basic HTTP Auth Proxy for Vercel, ideal for adding simple password protection to staging applications.

The idea for this project comes from https://github.com/bbiHQ/simple-basic-http-auth-proxy-vercel , thanks a lot.

这个项目想法来自 https://github.com/bbiHQ/simple-basic-http-auth-proxy-vercel 感谢作者

This project uses [node-http-proxy](https://github.com/http-party/node-http-proxy) inside a serverless function to add
basic password protection to ORIGIN site via HTTP Auth, requiring no code change to the ORIGIN deployment. This is designed
to add simple password protection to deployments during the UAT stage.

## Getting Started

1. Deploying this project to Vercel Now<br/>[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/vrcms/simple-proxy-with-auth/tree/master/)

2. How to use:
Username: admin
Password: 123456
u can change this config in the file: ./api/node-proxy.js
  
3. Change target website:

input target domain,and click the blue button,u can go...

4. Clean:
sometimes,u need clean the target website,u can visit https://***.vercel.app/C/



## 中文
1. 一个简单的带有用户验证的可以部署在vercel的小模块。
2. 点击上面的按钮部署
3. 默认用户密码
admin
123456
你可以在node-proxy.js 文件里更改这个配置
4. 部署完成后，可以尝试访问 https://***.vercel.app 即可看到效果
5. 可以访问其他网址, 请输域名即可访问。
6. 清除 https://***.vercel.app/C/ 将回到默认网址 


