/* 
 * _____/\\\\\\\\\_____/\\\\\\\\\\\\\\\__/\\\\\_____/\\\__/\\\\\\\\\\\\\_______/\\\\\\\\\\\\_______/\\\\\______        
 *  ___/\\\\\\\\\\\\\__\///////\\\/////__\/\\\\\\___\/\\\_\/\\\/////////\\\___/\\\//////////______/\\\///\\\____       
 *   __/\\\/////////\\\_______\/\\\_______\/\\\/\\\__\/\\\_\/\\\_______\/\\\__/\\\_______________/\\\/__\///\\\__      
 *    _\/\\\_______\/\\\_______\/\\\_______\/\\\//\\\_\/\\\_\/\\\\\\\\\\\\\/__\/\\\____/\\\\\\\__/\\\______\//\\\_     
 *     _\/\\\\\\\\\\\\\\\_______\/\\\_______\/\\\\//\\\\/\\\_\/\\\/////////____\/\\\___\/////\\\_\/\\\_______\/\\\_    
 *      _\/\\\/////////\\\_______\/\\\_______\/\\\_\//\\\/\\\_\/\\\_____________\/\\\_______\/\\\_\//\\\______/\\\__   
 *       _\/\\\_______\/\\\_______\/\\\_______\/\\\__\//\\\\\\_\/\\\_____________\/\\\_______\/\\\__\///\\\__/\\\____  
 *        _\/\\\_______\/\\\_______\/\\\_______\/\\\___\//\\\\\_\/\\\_____________\//\\\\\\\\\\\\/_____\///\\\\\/_____ 
 *         _\///________\///________\///________\///_____\/////__\///_______________\////////////_________\/////_______
 */

/* global _, Notification, i18n, Promise, fetch */

const siteMapUrl = 'site/sitemap.json';
requirejs([
    'jquery-3.2.1.min',
    'promise.min',
    'fetch'
], () => {
    app.toggleSpinner(true);
    requirejs([
        'moment.min',
        "handlebars-v4.0.5",
        "showdown.min",
        "bootstrap",
        "underscore-1.8.3.min"
    ], (moment, handlebars, showdown) => {
        window.moment = moment;
        window.Handlebars = handlebars;
        app.mdConverter = new showdown.Converter({
            strikethrough: true,
            tables: true
        });
        $(document).ready(app.Initialize);
    });
});

const app = {
    container: null,
    site: null,
    toggleSpinner: state => {
        var $spinner = $('.spinner-overlay');
        if (typeof (state) === 'undefined') {
            if ($spinner.is(':visible')) {
                $spinner.fadeOut('fast');
            } else {
                if ($spinner.length === 0) {
                    $('body').prepend($('#SpinnerTemplate').html());
                }
                $('.spinner-overlay').fadeIn('fast');
            }
        } else if (state) {
            if ($spinner.length === 0) {
                $('body').prepend($('#SpinnerTemplate').html());
            }
            $('.spinner-overlay').fadeIn('fast');
        } else {
            $spinner.fadeOut('fast');
        }
    },
    loadExtTemplate: path => {
        const loadSingleTemplate = (p, callback) => {
            p = 'templates/' + p + '.html';
            const scriptId = p.replace(/\./g, "-").replace(/\//g, "-");
            if ($('#' + scriptId).length > 0) {
                callback($('#' + scriptId).html());
                return;
            }
            $.get({
                url: p,
                success: (templateData) => {
                    const script = document.createElement("script");
                    script.id = scriptId;
                    script.innerHTML = templateData;
                    script.type = "text/x-handlebars-template";
                    document.head.appendChild(script);
                    callback(templateData);
                }
            });
        };
        const promises = [];

        if (_.isString(path)) {
            promises.push(new Promise((resolve) => {
                loadSingleTemplate(path, (template) => {
                    resolve(Handlebars.compile(template));
                });
            }));
        } else if (_.isArray(path)) {
            path.forEach((p) => {
                promises.push(new Promise((resolve) => {
                    loadSingleTemplate(p, (template) => {
                        resolve(Handlebars.compile(template));
                    });
                }));
            });
        }
        return Promise.all(promises);
    },
    buildCurrentPage: pushHistory => {

        app.container.empty();
        Promise.all([
            fetch(siteMapUrl).then(response => {
                return response.json();
            }),
            app.loadExtTemplate('root')
        ]).then(data => {
            app.site = data[0];
            app.rootTemplate = data[1][0];
            document.title = app.site.title;
            requirejs(['buildPage'], buildPage => {
                buildPage(_.findWhere(app.site.pages, {href: decodeURI(window.location.hash.substring(1))}), pushHistory);
            });
        });
    },
    // initialises the application.
    Initialize: () => {
        // bind window/body events.
        window.onpopstate = () => {
            app.buildCurrentPage(false);
        };
        Handlebars.registerHelper('currentYear', () => {
            return (new Date()).getFullYear();
        });
        app.container = $('#app-container');
        app.buildCurrentPage(true);
    }
};