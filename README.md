## 开发环境准备

* **nodejs安装**

下载window安装包[node-v8.10.0](http://yum.longcloud.tech:99/release/software/node-v8.10.0-x64.msi)。
下载完后，双击默认安装即可。

nodejs学习文档，请点击[这里](http://nodejs.cn/api/)。

nodejs发展历史，介绍的不错。请点击[这里](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501245426ad4b91f2b880464ba876a8e3043fc8ef000)。

安装好后，打开命令行，执行````node --version````查看版本号。

* **安装项目所需依赖**

执行命令````npm install````。如果安装比较慢或者未能正常安装，请使用淘宝镜像安装。
````npm --registry https://registry.npm.taobao.org install````。

* **安装gulp**

执行如下命令安装gulp

````npm install gulp -g````

# 运行gulp

````gulp default````

# 访问

打开浏览器输入地址````http://localhost:8080````访问。

# 技术说明

使用webpack作为模块加载的工具，gulp进行压缩、反向代理




