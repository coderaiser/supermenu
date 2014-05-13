var menu, MenuIO;

(function() {
    'use strict';
    
    var element = document.querySelector('#js-menu-container'),
        options = {
            icon: true
        };
    
    menu = MenuIO(element, options, {
        'help': function() {
            console.log('*help');
        },
        'upload': {
            'github': {
                'gist': function() {
                    console.log('*gist');
                },
                'main': function() {
                    console.log('*main');
                }
            },
            'dropbox': function() {
                console.log('*dropbox');
            }
        },
        'view': function() {
            console.log('*view');
        },
        'edit': function() {
            console.log('edit');
        },
       'download': {
            'github': {
                'gist': function() {
                    console.log('*gist');
                },
                'main': function() {
                    console.log('*main');
                }
            },
            'dropbox': function() {
                console.log('*dropbox');
            }
        },
    });
})();
