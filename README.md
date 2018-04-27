Supermenu [![Build Status][BuildStatusIMGURL]][BuildStatusURL]
====
[BuildStatusURL]:           https://travis-ci.org/coderaiser/menu-io  "Build Status"
[BuildStatusIMGURL]:        https://api.travis-ci.org/coderaiser/menu-io.png?branch=gh-pages

Simple css-based context menu made for [Cloud Commander](http://cloudcmd.io).

Little bit better then other people do :).

# How come?

Tired to use js based libraries which use jquery and `.hover` classes insteed of `:hover` pseudo-selectors.

# Install

```
npm i supermenu
```

# How use?

Add little JavaScript:

```js
const supermenu = require('supermenu');
const menu = supermenu({
    'item name': () => {
    }
}
```

You could use element and (or) options parameters if you need to.

```js
const element = document.body;

const options = {
    icon        : true, /* add class icon-item-name */
    beforeClose : alert,
    beforeShow  : alert,
    beforeClick : alert,
    name        : 'name of menu' /* if you want use a couple menu on one element */
};

const menu = supermenu(element, options, {
    'item name': () => {
});
```

Look for `examples` directory or copy example from bottom:

```js
const menu = supermenu({
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
```

# License
MIT
