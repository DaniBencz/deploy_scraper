(this.webpackJsonpblog_scraper_ui=this.webpackJsonpblog_scraper_ui||[]).push([[0],{14:function(e,t,n){e.exports=n.p+"static/media/github_blue.5abf563c.png"},15:function(e,t,n){e.exports=n.p+"static/media/straight-loader.91931453.gif"},16:function(e,t,n){e.exports=n(40)},21:function(e,t,n){},22:function(e,t,n){},40:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(12),i=n.n(o),c=(n(21),n(2)),l=(n(22),function(e){var t=e.articles;return r.a.createElement("div",{id:"list"},r.a.createElement("ul",null,t.map((function(e,t){return r.a.createElement("li",{key:t},r.a.createElement("a",{href:e,rel:"noopener noreferrer",target:"_blank"},e))}))))}),u=n(13),s=n.n(u),m=n(14),d=n.n(m),p=n(15),g=n.n(p);var h=function(){var e=Object(a.useRef)(),t=Object(a.useState)([]),n=Object(c.a)(t,2),o=n[0],i=n[1],u=Object(a.useState)(0),m=Object(c.a)(u,2),p=m[0],h=m[1];return r.a.createElement("div",{id:"app"},r.a.createElement("div",{id:"repo"},r.a.createElement("a",{href:"https://github.com/DaniBencz/blog_scraper",rel:"noopener noreferrer",target:"_blank"},r.a.createElement("img",{alt:"gitHub repo",src:d.a,width:"33",height:"33"}))),r.a.createElement("div",{id:"form"},r.a.createElement("h2",{id:"instructions"},"Please type a number between 1 and 5, or leave empty!"),r.a.createElement("input",{id:"page_value",type:"text",onChange:function(t){e.current=Number(t.target.value)}}),r.a.createElement("button",{id:"get_articles",onClick:function(){var t;(t=e.current,new Promise((function(e,n){void 0===t&&e(1),"number"===typeof t&&t>=0&&t<6?(0===t&&(t=1),e(t)):n()}))).then((function(e){h(1),i([]),s()({url:"".concat(window.location.origin,"/articles"),method:"post",data:{pages:e}}).then((function(e){i(e.data.articles),h(0)})).catch((function(e){h(0),alert("Something went wrong, please try again later!")}))})).catch((function(){console.log("Input must be a number between 1 and 5")}))}},"Get Articles")),p?r.a.createElement("div",{id:"loader"},r.a.createElement("img",{alt:"loader",src:g.a,width:"200",height:"150"})):null,r.a.createElement(l,{articles:o}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(h,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[16,1,2]]]);
//# sourceMappingURL=main.7c846431.chunk.js.map