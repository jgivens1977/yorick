define(function(){"use strict";function t(t){return encodeURIComponent(t).replace(o,s)}function n(t){return decodeURIComponent(t.replace(a," "))}function e(t){if(this[h]=Object.create(null),t){"?"===t.charAt(0)&&(t=t.slice(1));for(var e,r,i=(t||"").split("&"),o=0,a=i.length;o<a;o++)r=i[o],e=r.indexOf("="),-1<e?this.append(n(r.slice(0,e)),n(r.slice(e+1))):r.length&&this.append(n(r),"")}}function r(){try{return!!Symbol.iterator}catch(t){return!1}}var i=e.prototype,o=/[!'\(\)~]|%20|%00/g,a=/\+/g,c={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"},s=function(t){return c[t]},u=r(),h="__URLSearchParams__:"+Math.random();i.append=function(t,n){var e=this[h];t in e?e[t].push(""+n):e[t]=[""+n]},i["delete"]=function(t){delete this[h][t]},i.get=function(t){var n=this[h];return t in n?n[t][0]:null},i.getAll=function(t){var n=this[h];return t in n?n[t].slice(0):[]},i.has=function(t){return t in this[h]},i.set=function(t,n){this[h][t]=[""+n]},i.forEach=function(t,n){var e=this[h];Object.getOwnPropertyNames(e).forEach(function(r){e[r].forEach(function(e){t.call(n,e,r,this)},this)},this)},i.keys=function(){var t=[];this.forEach(function(n,e){t.push(e)});var n={next:function(){var n=t.shift();return{done:void 0===n,value:n}}};return u&&(n[Symbol.iterator]=function(){return n}),n},i.values=function(){var t=[];this.forEach(function(n){t.push(n)});var n={next:function(){var n=t.shift();return{done:void 0===n,value:n}}};return u&&(n[Symbol.iterator]=function(){return n}),n},i.entries=function(){var t=[];this.forEach(function(n,e){t.push([e,n])});var n={next:function(){var n=t.shift();return{done:void 0===n,value:n}}};return u&&(n[Symbol.iterator]=function(){return n}),n},u&&(i[Symbol.iterator]=i.entries),i.toJSON=function(){return{}},i.toString=function(){var n,e,r,i,o=this[h],a=[];for(e in o)for(r=t(e),n=0,i=o[e];n<i.length;n++)a.push(r+"="+t(i[n]));return a.join("&")};var f=Object.defineProperty,l=Object.getOwnPropertyDescriptor,p=function(t){function n(n,e){i.append.call(this,n,e),n=this.toString(),t.set.call(this._usp,n?"?"+n:"")}function e(n){i["delete"].call(this,n),n=this.toString(),t.set.call(this._usp,n?"?"+n:"")}function r(n,e){i.set.call(this,n,e),n=this.toString(),t.set.call(this._usp,n?"?"+n:"")}return function(t,i){return t.append=n,t["delete"]=e,t.set=r,f(t,"_usp",{configurable:!0,writable:!0,value:i})}},v=function(t){return function(n,e){return f(n,"_searchParams",{configurable:!0,writable:!0,value:t(e,n)}),e}},d=function(t){var n=t.append;t.append=i.append,e.call(t,t._usp.search.slice(1)),t.append=n},m=function(t,n){if(!(t instanceof n))throw new TypeError("'searchParams' accessed on an object that does not implement interface "+n.name)},g=function(t){var n,r=t.prototype,i=l(r,"searchParams"),o=l(r,"href"),a=l(r,"search");!i&&a&&a.set&&(n=v(p(a)),Object.defineProperties(r,{href:{get:function(){return o.get.call(this)},set:function(t){var n=this._searchParams;o.set.call(this,t),n&&d(n)}},search:{get:function(){return a.get.call(this)},set:function(t){var n=this._searchParams;a.set.call(this,t),n&&d(n)}},searchParams:{get:function(){return m(this,t),this._searchParams||n(this,new e(this.search.slice(1)))},set:function(e){m(this,t),n(this,e)}}}))};return g(HTMLAnchorElement),/^function|object$/.test(typeof URL)&&URL.prototype&&g(URL),e});