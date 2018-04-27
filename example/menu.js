(function() {
    'use strict';
    
    const element = document.querySelector('#js-menu-container');
    const options = {
        icon: true
    };
    
     supermenu(element, options, {
        'help': () => {
            console.log('*help');
        }
    });
})();

