# 空间管理

> 以vue-element-admin为基础，修改了部分UI。

## Build Setup

```bash
# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

# 注意：
## API自定义封装
  ```
  @/utils/request.js
  @/utils/requestCustom.js
  ```
  用户信息请求线上 mock ，使用request.js
  内部api使用requestCustom.js

## 有问题随时联系：
  ```
  微信: hollong
  QQ: 478122418
  ```