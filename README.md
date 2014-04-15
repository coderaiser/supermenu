Menu [BuildStatusURL][BuildStatusURL]
====
[BuildStatusURL]:           https://travis-ci.org/coderaiser/menu  "Build Status"

Simple css-based context menu made for [Cloud Commander](http://cloudcmd.io).

Little bit better then other people do :).
So to see at work look [here](http://jsfiddle.net/coderaiser/mAUUz/).

#How come?

Tired to use js based libraries which use jquery and `.hover` classes insteed of `:hover` pseudo-selectors.

#Why should I care?

- `1.6kb` min & gzip for js.
- `1kb` min & gzip  for css.
- no dependencies (just part of [util.io](http://coderaiser.github.io/util.io)).
- easy to use.
- easy to extend.

#How use?
Crete `html` page with `js` and `css` connected.

```html
<link rel="stylesheet" href="http://coderaiser.github.io/menu/menu.min.css">
<script src="http://coderaiser.github.io/menu/menu.min.js"></script>
```

Add little JavaScript:
```js
var menu        = new MenuProto({
    'item name': function onItemNameClick() {
    }
}
```

Look for `examples` directory or copy example from bottom:

```html
<link rel="stylesheet" href="http://coderaiser.github.io/menu/menu.min.css">
<script src="http://coderaiser.github.io/menu/menu.min.js"></script>
<script>
    window.addEventListener('load', function onLoad() {
        'use strict';
        
        window.removeEventListener('load', onLoad);
        var menu        = new MenuProto({
            help: function() {
                alert('*help');
            },
            upload: {
                github: {
                    gist: function() {
                        alert('*gist');
                    },
                    main: function() {
                        alert('*main');
                    }
                },
                dropbox: function() {
                    alert('*dropbox');
                }
            }
        });
    });
</script>
```
