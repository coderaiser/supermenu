menu
====

Simple css-based context menu made for [Cloud Commander](http://cloudcmd.io).

Little bit better then other people do :).
So to see at work look [here](http://jsfiddle.net/coderaiser/mAUUz/).

#How use this thing?
Crete `html` page with `js` and `css` connected.

```html
<link rel="stylesheet" href="http://coderaiser.github.io/menu/menu.min.css">
<script src="http://coderaiser.github.io/menu/menu.min.js"></script>
<script>
    window.addEventListener('load', function onLoad() {
        'use strict';
        
        var menu;
        
        window.removeEventListener('load', onLoad);
        
        menu        = new MenuProto({
            'help': function() {
                alert('*help');
            },
            'upload': {
                'github': {
                    'gist': function() {
                        alert('*gist');
                    },
                    'main': function() {
                        alert('*main');
                    }
                },
                'dropbox': function() {
                    alert('*dropbox');
                }
            }
        });
    });
</script>
```
