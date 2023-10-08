# 开发注意事项

- 公司项目情况

  在我们公司的软件开发有点小复杂：
  一、已经有大量老页面开发存在，短时间内不会修改这些页面。
  二、同时有多个软件项目存在。
  三、软件部署在客户那里时对前缀有要求（客户也有很多软件，需要根据路径访问不同的软件）。

  因此我们对软件一些下列限制
  一、URL 有一个前缀，它是不固定的，可变的
  二、菜单不仅是本模块，还有其它模块，但是要求像是同一个软件内

  我们的方案如下：

  在开发中你需要访问软件时，它所有页面的 url 都有一个前缀 /xxx， 它在客户那里安装时会被修改，所以你在写页时访问 api 时不能写死路径，你需要用下面的变量生成一个 url，另外本项目的访问需要再加一节路径，如/xxx/boo 这个样子。

  所以这个有两个变量，一个是访问本软件时的统一前缀（/xxx）， 一个是访问本软件中本模块时的前缀（/xxx/boo）

  因为这些前缀是软件打包好了后，在用户现场修改的，所以我们会在软件中修改 index.html 中的一些变量, 为了开发方便我们用 env 中的变量调整这些变量的生成，development 和 production 会生成不同值。

  我们在 index.html 中定义了八个全局变量

      var basePathWithoutSlash = '<%- VITE_APP_BASE_PATH_WITHOUT_SLASH %>';
      var basePathWithSlash = '<%- VITE_APP_BASE_PATH_WITH_SLASH %>';
      var apiPrefix = '<%- VITE_APP_API_URL %>';
      var appPrefixWithoutHash = "<%- VITE_APP_APP_PREFIX_WITHOUT_SLASH %>";
      var appPrefixWithHash = appPrefixWithoutHash + "/#";
      var appTitle = "<%- VITE_APP_HEAD_TITLE %>";
      var footTitle = "<%- VITE_APP_FOOT_TITLE %>";

  其中

       sessionKey           是登录会话 cookie 的 key 名称
       basePathWithoutSlash 相当于 /xxx
       basePathWithSlash    相当于 /xxx/
       apiPrefix            相当于 /xxx/api
       appPrefixWithoutHash 相当于 /xxx/boo
       appPrefixWithHash    相当于 /xxx/boo/#
       appTitle 为软件标题
       footTitle 为软件版权说明

  你可以在任何地方用 window.XXX 形式来访问它，在 Typescript 时用 (window as any).XXX, 如

       window.basePathWithSlash

- 调试运行

  当你开始开发时需要修改一下 VITE_PROXY 中的 url

- 登录认证

  我们后台检测用户是否已登录，是检测 cookie 值， 这个 cookie 的名称保存在 sessionKey 变量中，前台也请用这个来判断

- 项目同步说明

  前面我也说了， 我们有多个项目， 以后都会用本项目改造， 本项目有更新时也希望可以同步到这些项目中去，为了同步方便，我作了如下规定

  1. 除了下面文件外，其它文件不可修改（也不可删除）, 当本项目变更时，我会用本项目中的文件覆盖其它项目中的文件（当然我会排除下列文件）。
     package.json
     src\routers\custom.ts
     src\config\custom.ts
     .env
     .env.test
     .env.development
     .env.production
     .gitignore

     1.1 src\routers\custom.ts 你在这里将将页面添加到菜单中， 菜单的顺序也在这里调整
     1.2 src\config\custom.ts 你可以在这里添加你自已的一些全局的配置，以及修改一些默认配置

  2. 其它项目从本项目 fork 时可以任意添加新文件新功能，可以在 src\routers\custom.ts 中修改路由，不要修改从本项目中拷贝的文件（假如有需要修改请联系我，我改好后再同步）。

- 开发时注意一下这个 vite 的 BUG

  当我们在开发模式下运行程序，没有登录时直接访问页面时需要跳转到 sso 登录页面，跳转时需要将当前页面的 url 作为 query 参数，这参数在 vite devServer 代理转发时会丢弃 query 参数，这导致 sso 登录页面接收不到 query 参数，它在登录后无法返回访问跳转的页面

  这个 bug 请见 https://github.com/vitejs/vite/issues/7999 和 https://github.com/vbenjs/vite-plugin-html/issues/38

  这个不影响产生环境，对开发有点小影响，你可以按他们的说法作如下修改

  node_modules\vite-plugin-html\dist\index.mjs:284行
  node_modules\vite-plugin-html\dist\index.cjs:297行

  将
  return isApiUrl ? excludeBaseUrl : template;
  改成
  return isApiUrl ? parsedUrl.path : template;
