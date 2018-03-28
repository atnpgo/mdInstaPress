/* 
 *   _____/\\\\\\\\\_____/\\\\\\\\\\\\\\\__/\\\\\_____/\\\__/\\\\\\\\\\\\\_______/\\\\\\\\\\\\_______/\\\\\______        
 *    ___/\\\\\\\\\\\\\__\///////\\\/////__\/-\\\\\\___\/\\\_\/\\\/////////\\\___/\\\//////////______/\\\///\\\____       
 *     __/\\\/////////\\\_______\/\\\_______\/\\\/\\\__\/\\\_\/\\\_______\/\\\__/\\\_______________/\\\/__\///\\\__      
 *      _\/\\\_______\/\\\_______\/\\\_______\/\\\//\\\_\/\\\_\/\\\\\\\\\\\\\/__\/\\\____/\\\\\\\__/\\\______\//\\\_     
 *       _\/\\\\\\\\\\\\\\\_______\/\\\_______\/\\\\//\\\\/\\\_\/\\\/////////____\/\\\___\/////\\\_\/\\\_______\/\\\_    
 *        _\/\\\/////////\\\_______\/\\\_______\/\\\_\//\\\/\\\_\/\\\_____________\/\\\_______\/\\\_\//\\\______/\\\__   
 *         _\/\\\_______\/\\\_______\/\\\_______\/\\\__\//\\\\\\_\/\\\_____________\/\\\_______\/\\\__\///\\\__/\\\____  
 *          _\/\\\_______\/\\\_______\/\\\_______\/\\\___\//\\\\\_\/\\\_____________\//\\\\\\\\\\\\/_____\///\\\\\/_____ 
 *           _\///________\///________\///________\///_____\/////__\///_______________\////////////_________\/////_______
 */


const out = './bakeOut/';


const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const converter = new showdown.Converter({
    strikethrough: true,
    tables: true
});
const Handlebars = require('./js/handlebars-v4.0.5');
const _ = require('./js/underscore-1.8.3.min');
const moment = require('./js/moment.min');

const siteData = JSON.parse(fs.readFileSync(require('./siteMapUrl'), 'utf8'));
const rootPage = fs.readFileSync('index.html', 'utf8');
const rootTemplate = Handlebars.compile(fs.readFileSync('templates/root.html/', 'utf8'));


Handlebars.registerHelper('highlight', function (context, options) {
    return `<pre><code${context ? ' class="' + context + '"' : ''}>${options.fn(this).substring(1)}</code></pre>`;
});

const getFile = path => {
    if (path.startsWith('http')) {

    } else {
        return fs.readFileSync(path, 'utf8');
    }
};


const ensureDirectoryExistence = filePath => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const generateSinglePage = page => {
    const fileOut = out + page.href.substring(1) + 'index.html';
    let path = '';
    for (let i = 1; i < fileOut.split('/').length - 1; i++) {
        path += '../';
    }
    ensureDirectoryExistence(fileOut);
    fs.writeFileSync(fileOut, rootPage
            .replace(/<script data-main=".\/js\/app.js" src=".\/js\/require-2.1.22.min.js" type="text\/javascript"><\/script>/g, '')
            .replace(/<noscript><h1>Javascript needs to be enabled to use this site.<\/h1><\/noscript>/g, '')
            .replace(/<div class="spinner-overlay" style="margin-top:0px;"><div class="spinner"><\/div><\/div>/g, '')
            .replace(/<link href='css\/app.css' rel='stylesheet' type='text\/css'>/g, '<link href="' + path + 'css/app.css" rel="stylesheet" type="text/css">')
            .replace(/<div id="app-container"><\/div>/g, rootTemplate((Object.assign({
                main: Handlebars.compile(fs.readFileSync('templates/page-types/' + page.type + '.html', 'utf8'))(Object.assign({
                    main: Handlebars.compile(converter.makeHtml(getFile(page.source)))()
                }, page)),
                navbar: _.filter(siteData.pages, page => {
                    return _.contains(siteData.navlinks, page.href);
                }),
                posts: _.sortBy(_.filter(siteData.pages, page => {
                    return !_.isUndefined(page.date);
                }), post => {
                    return moment(post.date).toDate().getTime();
                }).reverse().splice(0, 5)
            }
            , siteData)))), 'UTF-8');
};
deleteFolderRecursive(out);
siteData.pages.forEach(generateSinglePage);
