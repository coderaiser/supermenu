var MenuProto;

(function() {
    'use strict';
    
    var  menu;
    
    menu = new MenuProto({
        'help': function() {
            console.log('*help');
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
        }
    });
})();
