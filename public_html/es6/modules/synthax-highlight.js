/* 
 *   _____/\\\\\\\\\_____/\\\\\\\\\\\\\\\__/\\\\\_____/\\\__/\\\\\\\\\\\\\_______/\\\\\\\\\\\\_______/\\\\\______        
 *    ___/\\\\\\\\\\\\\__\///////\\\/////__\/\\\\\\___\/\\\_\/\\\/////////\\\___/\\\//////////______/\\\///\\\____       
 *     __/\\\/////////\\\_______\/\\\_______\/\\\/\\\__\/\\\_\/\\\_______\/\\\__/\\\_______________/\\\/__\///\\\__      
 *      _\/\\\_______\/\\\_______\/\\\_______\/\\\//\\\_\/\\\_\/\\\\\\\\\\\\\/__\/\\\____/\\\\\\\__/\\\______\//\\\_     
 *       _\/\\\\\\\\\\\\\\\_______\/\\\_______\/\\\\//\\\\/\\\_\/\\\/////////____\/\\\___\/////\\\_\/\\\_______\/\\\_    
 *        _\/\\\/////////\\\_______\/\\\_______\/\\\_\//\\\/\\\_\/\\\_____________\/\\\_______\/\\\_\//\\\______/\\\__   
 *         _\/\\\_______\/\\\_______\/\\\_______\/\\\__\//\\\\\\_\/\\\_____________\/\\\_______\/\\\__\///\\\__/\\\____  
 *          _\/\\\_______\/\\\_______\/\\\_______\/\\\___\//\\\\\_\/\\\_____________\//\\\\\\\\\\\\/_____\///\\\\\/_____ 
 *           _\///________\///________\///________\///_____\/////__\///_______________\////////////_________\/////_______
 */


/* global hljs */

define(() => {
    return {
        setup: (resolve) => {
            $('head').append('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css">');
            Handlebars.registerHelper('highlight', function (context, options) {
                console.log('context', context);
                console.log('options', options);
                return `<pre><code${context ? ' class="' + context + '"' : ''}>${options.fn(this).substring(1)}</code></pre>`;
            });
            
            requirejs(['//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js'], resolve);
            
        },
        render: () => {
            $('pre code').each((i, block) => {
                hljs.highlightBlock(block);
            });
        }
    };
});