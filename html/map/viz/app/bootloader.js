!function(a,e){"use strict";var t=function(){a.dojoConfig=o,$(e).ready(function(){$.get("./app/templates/app.html",function(a){$("body").html(a),$(e).foundation()})})},n=location.pathname.replace(/\/[^\/]+$/,"")+"/app",o={parseOnLoad:!1,isDebug:!1,async:!0,packages:[{name:"map",location:n+"/js/map"},{name:"main",location:n+"/js/main"},{name:"utils",location:n+"/js/utils"},{name:"tools",location:n+"/js/tools"},{name:"components",location:n+"/js/components"},{name:"widgets",location:n+"/widgets"},{name:"table",location:n+"/js/table"}],aliases:[["react","app/includes/react/react2.js"],["leaflet","app/includes/leaflet/leaflet.js"],["esrileaflet","http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/1.0.0-rc.5/esri-leaflet.js"],["cluster","app/includes/markercluster/js/leaflet.markercluster-src.js"]],deps:["dojo/domReady!"],callback:function(){s("app/js/loader.js")}},s=function(a){var t=e.createElement("script");t.type="text/javascript",t.src=a,$("head").append(t)};a.onload=t()}(window,document);