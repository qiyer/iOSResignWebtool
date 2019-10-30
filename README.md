# iOSResignWebtool
node.js作为服务端，调用shell脚本进行iOS包重签名。  


### 需要安装：nodejs ，forever  

安装环境： 
- 安装nodejs 
- 安装forever: npm install forever -g  
- 后台启动命令:forever start -l forever.log -o out.log -e err.log /Users/xxx/nodejs/server.js  
- 再次启动命令:forever start -a -l forever.log -o out.log -e err.log /Users/xxx/nodejs/server.js  


#### nodejs相关：server.js  
#### 重签名脚本：resign.sh  

### 使用注意点：  
- 修改resign.sh文件里，证书 和 .moblieprovision 名称为自己公司的；    
- 替换nodejs/ipas/文件下 .moblieprovision  和 entitlement.plist为自己公司的；  
