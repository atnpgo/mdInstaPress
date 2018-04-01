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


/* global hljs, DISQUS, _ */

define(() => {

    const formClass = 'md-form';

    let data = {
        btnText: null,
        btnClass: null
    };

    const getUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const createControl = (type, name, options) => {
        const $ret = $('<div>', {
            'class': 'form-group'
        });

        const $control = $('<' + type + '>', {
            'class': 'form-control', name
        });
        $ret.append($control);
        if (options && options.hash) {
            _.each(options.hash, (value, key) => {
                switch (key) {
                    case 'label':
                        const lblId = getUUID();
                        $ret.prepend($('<label>', {
                            'for': lblId,
                            'html': value
                        }));
                        $control.attr('id', lblId);
                        break;
                    case 'small':
                        const smallId = getUUID();
                        $ret.append($('<small>', {
                            'id': smallId,
                            'class': 'form-text text-muted',
                            'html': value
                        }));
                        $control.attr('aria-describedby', smallId);
                        break;
                    default:
                        $control.attr(key, options.hash[key]);
                        break;
                }
            });
        }
        return $ret;
    };

    return {
        setup: (d, resolve) => {
            data = d;
            Handlebars.registerHelper('md-input', function (name, options) {
                return createControl('input', name, options)[0].outerHTML;
            });
            Handlebars.registerHelper('md-textarea', function (name, options) {
                return createControl('textarea', name, options)[0].outerHTML;
            });
            Handlebars.registerHelper('md-checkbox', function (name, options) {
                const $ret = $('<div>', {
                    'class': 'form-check'
                });
                const $control = $('<input>', {
                    'type': 'checkbox',
                    'class': 'form-check-input',
                    name
                });
                $ret.append($control);
                if (options && options.hash) {
                    _.each(options.hash, (value, key) => {
                        switch (key) {
                            case 'label':
                                const lblId = getUUID();
                                $ret.append($('<label>', {
                                    'for': lblId,
                                    'class': 'form-check-label',
                                    'html': value
                                }));
                                $control.attr('id', lblId);
                                break;
                            default:
                                $control.attr(key, options.hash[key]);
                                break;
                        }
                    });
                }
                return $ret[0].outerHTML;
            });
            Handlebars.registerHelper('md-select', function (name, options) {
                const control = createControl('select', name, options);
                control.find('select').html(options.fn(this));
                return control[0].outerHTML;
            });
            Handlebars.registerHelper('md-form', function (context, options) {
                const $form = $('<form>', {
                    'class': formClass
                });

                if (options && options.hash) {
                    Object.keys(options.hash).forEach(key => {
                        $form.attr(key, options.hash[key]);
                    });
                }

                $form.html(options.fn(this));
                $form.append($('<button>', {
                    'type': 'submit',
                    'text': data && data.btnText ? data.btnText : 'Submit',
                    'class': data && data.btnClass ? data.btnClass : 'btn btn-primary pull-right'
                }));
                return `<div class="card"><h3 class="card-header">${context}</h3><div class="m-2">${$form[0].outerHTML}</div></div>`;
            });
            resolve();
        },
        render: () => {

        }
    };
});