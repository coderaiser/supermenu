# Supermenu

Simple css-based context menu made for [Cloud Commander](http://cloudcmd.io).
Little bit better then others :).

## How come?

Tired to use js based libraries which use jquery and `.hover` classes insteed of `:hover` pseudo-selectors.

## Install

```
npm i supermenu
```

## How use?

Add little JavaScript:

```js
const supermenu = require('supermenu');
const menu = supermenu({
    'item name': () => {},
});

// show menu on right mouse click
menu.addContextMenuListener();
```

You could use element and (or) options parameters if you need to.

```js
const element = document.body;
const log = (msg) => () => console.log(msg);

const options = {
    icon: true,
    /* add class icon-item-name */
    beforeShow: log('before show'),
    afterShow: log('after show'),
    beforeHide: log('beforeHide'),
    afterHide: log('after hide'),
    beforeClick: log('before click'),
    afterClick: log('after click'),
    name: 'name of menu', /* if you want use a couple menu on one element */
};

const menu = supermenu(element, options, {
    'item name': () => {},
});
```

Example of multilevel menu:

```js
const menu = supermenu({
    help() {
        alert('*help');
    },
    upload: {
        github: {
            gist() {
                alert('*gist');
            },
            main() {
                alert('*main');
            },
        },
        dropbox() {
            alert('*dropbox');
        },
    },
});
```

## License

MIT
