/* 
 *  _____/\\\\\\\\\_____/\\\\\\\\\\\\\\\__/\\\\\_____/\\\__/\\\\\\\\\\\\\_______/\\\\\\\\\\\\_______/\\\\\______        
 *   ___/\\\\\\\\\\\\\__\///////\\\/////__\/\\\\\\___\/\\\_\/\\\/////////\\\___/\\\//////////______/\\\///\\\____       
 *    __/\\\/////////\\\_______\/\\\_______\/\\\/\\\__\/\\\_\/\\\_______\/\\\__/\\\_______________/\\\/__\///\\\__      
 *     _\/\\\_______\/\\\_______\/\\\_______\/\\\//\\\_\/\\\_\/\\\\\\\\\\\\\/__\/\\\____/\\\\\\\__/\\\______\//\\\_     
 *      _\/\\\\\\\\\\\\\\\_______\/\\\_______\/\\\\//\\\\/\\\_\/\\\/////////____\/\\\___\/////\\\_\/\\\_______\/\\\_    
 *       _\/\\\/////////\\\_______\/\\\_______\/\\\_\//\\\/\\\_\/\\\_____________\/\\\_______\/\\\_\//\\\______/\\\__   
 *        _\/\\\_______\/\\\_______\/\\\_______\/\\\__\//\\\\\\_\/\\\_____________\/\\\_______\/\\\__\///\\\__/\\\____  
 *         _\/\\\_______\/\\\_______\/\\\_______\/\\\___\//\\\\\_\/\\\_____________\//\\\\\\\\\\\\/_____\///\\\\\/_____ 
 *          _\///________\///________\///________\///_____\/////__\///_______________\////////////_________\/////_______
 */

/* global fetch, app, Promise, _ */

define(() => {
    /**
     * Builds a root 
     * @returns {function} A function that builds the root page.
     */
    const buildPage = (page, pushHistory) => {
        if (_.isUndefined(page)) {
            page = _.findWhere(app.site.pages, {href: '/'});
        }
        Promise.all([fetch(page.source).then(response => {
                return response.text();
            }).then(md => {
                return app.mdConverter.makeHtml(md);
            }), app.loadExtTemplate('page-types/' + page.type)
        ]).then(data => {
            app.container.html(app.rootTemplate(Object.assign({
                main: data[1][0](Object.assign({
                    main: Handlebars.compile(data[0])()
                }, page)),
                navbar: _.filter(app.site.pages, page => {
                    return _.contains(app.site.navlinks, page.href);
                }),
                posts: _.sortBy(_.filter(app.site.pages, page => {
                    return !_.isUndefined(page.date);
                }), post => {
                    return moment(post.date).toDate().getTime();
                }).reverse().splice(0, 5)
            }, app.site)));
            $('a').click(e => {
                const $target = $(e.currentTarget);
                if ($target.attr('href').startsWith('#/')) {
                    e.preventDefault();
                    app.toggleSpinner(true);
                    buildPage(_.findWhere(app.site.pages, {href: $target.attr('href').substring(1)}), true);
                }
            });
            if (pushHistory) {
                window.history.pushState({}, document.title, '#' + page.href);
            }
            
            app.plugins.forEach(plugin => {
                plugin.render()
            });
            
            
            app.toggleSpinner(false);
        });
    };
    return buildPage;
});