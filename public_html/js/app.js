'use strict';requirejs(['../siteMapUrl','jquery-3.2.1.min','promise.min','fetch'],function(a){app.toggleSpinner(!0),window.siteMapUrl=a,requirejs(['moment.min','handlebars-v4.0.5','showdown.min','bootstrap','underscore-1.8.3.min'],function(a,b,c){window.moment=a,window.Handlebars=b,app.mdConverter=new c.Converter({strikethrough:!0,tables:!0}),$(document).ready(app.Initialize)})});var app={container:null,site:null,plugins:[],toggleSpinner:function toggleSpinner(a){var b=$('.spinner-overlay');'undefined'==typeof a?b.is(':visible')?b.fadeOut('fast'):(0===b.length&&$('body').prepend($('#SpinnerTemplate').html()),$('.spinner-overlay').fadeIn('fast')):a?(0===b.length&&$('body').prepend($('#SpinnerTemplate').html()),$('.spinner-overlay').fadeIn('fast')):b.fadeOut('fast')},loadExtTemplate:function loadExtTemplate(a){var b=function(a,b){a='templates/'+a+'.html';var c=a.replace(/\./g,'-').replace(/\//g,'-');return 0<$('#'+c).length?void b($('#'+c).html()):void $.get({url:a,success:function success(a){var d=document.createElement('script');d.id=c,d.innerHTML=a,d.type='text/x-handlebars-template',document.head.appendChild(d),b(a)}})},c=[];return _.isString(a)?c.push(new Promise(function(c){b(a,function(a){c(Handlebars.compile(a))})})):_.isArray(a)&&a.forEach(function(a){c.push(new Promise(function(c){b(a,function(a){c(Handlebars.compile(a))})}))}),Promise.all(c)},buildCurrentPage:function buildCurrentPage(a){app.container.empty(),requirejs(['buildPage'],function(b){b(_.findWhere(app.site.pages,{href:decodeURI(window.location.hash.substring(1))}),a)})},Initialize:function Initialize(){window.onpopstate=function(){app.buildCurrentPage(!1)},Handlebars.registerHelper('currentYear',function(){return new Date().getFullYear()}),app.container=$('#app-container'),Promise.all([fetch(siteMapUrl).then(function(a){return a.json()}),app.loadExtTemplate('root')]).then(function(a){app.site=a[0],app.rootTemplate=a[1][0],document.title=app.site.title;var b=[!0];_.isArray(app.site.plugins)&&app.site.plugins.forEach(function(a){b.push(new Promise(function(b){requirejs(['modules/'+a],function(a){app.plugins.push(a),a.setup(b)})}))}),Promise.all(b).then(function(){app.buildCurrentPage(!0)})})}};