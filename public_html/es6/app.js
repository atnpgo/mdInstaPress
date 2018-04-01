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

requirejs([
    '../siteMapUrl',
    'jquery-3.2.1.min',
    'promise.min',
    'fetch'
], (siteMapUrl) => {
    app.toggleSpinner(true);
    window.siteMapUrl = siteMapUrl;
    requirejs([
        'moment.min',
        'handlebars-v4.0.5',
        'showdown.min',
        'bootstrap',
        'underscore-1.8.3.min'
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
    plugins: [],
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
    loadExtTemplate: p => {
        return new Promise(r => requirejs([`templates/${p}`], r));
    },
    buildCurrentPage: pushHistory => {
        app.container.empty();
        requirejs(['buildPage'], buildPage => {
            buildPage(_.findWhere(app.site.pages, {href: decodeURI(window.location.hash.substring(1))}), pushHistory);
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

        Promise.all([
            fetch(siteMapUrl).then(response => {
                return response.json();
            }),
            app.loadExtTemplate('root')
        ]).then(data => {
            app.site = data[0];
            app.rootTemplate = data[1];
            document.title = app.site.title;

            const promises = [true];
            if (!_.isUndefined(app.site.plugins)) {
                _.keys(app.site.plugins).forEach(pluginName => {
                    promises.push(new Promise(resolve => {
                        requirejs(['modules/' + pluginName], plugin => {
                            app.plugins.push(plugin);
                            plugin.setup(app.site.plugins[pluginName], resolve);
                        }, resolve);
                    }));
                });
            }
            Promise.all(promises).then(() => {
                app.buildCurrentPage(true);
            });
        });





    }
};