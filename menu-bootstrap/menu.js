(function() {
    'use strict';
    
    window.addEventListener('contextmenu', function(event) {
        var menu    = document.getElementById('js-menu'),
            x       = event.x,
            y       = event.y;
            
        menu.style.left     = x - 5 +'.px';
        menu.style.top      = y - 5 + '.px';
        
        menu.classList.add('open');
        event.preventDefault();
    });
    
    window.addEventListener('click', function() {
        var menu    = document.getElementById('js-menu');
        
        menu.classList.remove('open');
    });
})();
