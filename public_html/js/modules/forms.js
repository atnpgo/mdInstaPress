'use strict';define(function(){var a={btnText:null,btnClass:null},b=function(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(a){var b=0|16*Math.random(),c='x'===a?b:8|3&b;return c.toString(16)})},c=function(a,c,d){var e=$('<div>',{class:'form-group'}),f=$('<'+a+'>',{class:'form-control',name:c});return e.append(f),d&&d.hash&&_.each(d.hash,function(a,c){switch(c){case'label':var g=b();e.prepend($('<label>',{for:g,html:a})),f.attr('id',g);break;case'small':var h=b();e.append($('<small>',{id:h,class:'form-text text-muted',html:a})),f.attr('aria-describedby',h);break;default:f.attr(c,d.hash[c]);}}),e};return{setup:function setup(e,d){a=e,Handlebars.registerHelper('md-input',function(a,b){return c('input',a,b)[0].outerHTML}),Handlebars.registerHelper('md-textarea',function(a,b){return c('textarea',a,b)[0].outerHTML}),Handlebars.registerHelper('md-checkbox',function(a,c){var d=$('<div>',{class:'form-check'}),e=$('<input>',{type:'checkbox',class:'form-check-input',name:a});return d.append(e),c&&c.hash&&_.each(c.hash,function(a,f){switch(f){case'label':var g=b();d.append($('<label>',{for:g,class:'form-check-label',html:a})),e.attr('id',g);break;default:e.attr(f,c.hash[f]);}}),d[0].outerHTML}),Handlebars.registerHelper('md-select',function(a,b){var d=c('select',a,b);return d.find('select').html(b.fn(this)),d[0].outerHTML}),Handlebars.registerHelper('md-form',function(b,c){var d=$('<form>',{class:'md-form'});return c&&c.hash&&Object.keys(c.hash).forEach(function(a){d.attr(a,c.hash[a])}),d.html(c.fn(this)),d.append($('<button>',{type:'submit',text:a&&a.btnText?a.btnText:'Submit',class:a&&a.btnClass?a.btnClass:'btn btn-primary pull-right'})),'<div class="card"><h3 class="card-header">'+b+'</h3><div class="m-2">'+d[0].outerHTML+'</div></div>'}),d()},render:function render(){}}});