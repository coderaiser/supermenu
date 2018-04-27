'use strict';

require('../css/supermenu.css');

const rendy = require('rendy/legacy');

module.exports = Supermenu;

function Supermenu(element, options, menuData) {
    if (!(this instanceof Supermenu))
        return new Supermenu(element, options, menuData);
    
    const ElementFuncs = new ElementFuncsProto();
    
    let Options = {};
    let ElementMenu;
    let Element;
    let ElementHeight;
    let ElementWidth;
    let ElementEvent;
    const MenuFuncs = {};
    const TEMPLATE = {
        MAIN:   '<ul data-name="js-menu" class="menu menu-hidden">'                             +
                    '{{ items }}'                                                               +
                '</ul>',
        ITEM:   '<li data-name="js-menu-item" class="menu-item{{ className }}"{{ attribute }}>' +
                    '<label data-menu-path="{{ path }}">{{ name }}</label>'                     +
                    '{{ subitems }}'                                                            +
                '</li>'
    };
    
    if (menuData) {
        Element         =
        ElementEvent    = element;
        Options         = options;
    } else if (options) {
        Element         =
        ElementEvent    = element;
        menuData        = options;
    } else {
        Element         = document.body;
        ElementEvent    = window;
        menuData        = element;
    }
    
    function init() {
        const isObj = typeof menuData === 'object';
        
        if (!isObj) {
            const name            = menuData;
            menuData = {};
            menuData[name]  = null;
        }
        
        ElementMenu = createMenu(menuData);
        
        ElementEvent.addEventListener('click', onClick);
        ElementEvent.addEventListener('contextmenu', onContextMenu);
    }
    
    function createMenu(menuData) {
        let menu;
        let items = '';
        const buildItems  = (menuData, path) => {
            const DATA_MENU = 'data-menu="js-submenu"';
            const Data_KEY = 'data-key=';
            let items = '';
                
            if (path)
                path        += '.';
            else
                path        = '';
                
            Object.keys(menuData).forEach((name) => {
                let nameIcon;
                let key = '';
                let subitems = '';
                let className = '';
                let attribute = '';
                let pathName = path + name;
                    
                let data = menuData[name];
                const isObj = typeof data === 'object';
                    
                if (!isObj) {
                    MenuFuncs[pathName] = data;
                } else {
                    subitems = rendy(TEMPLATE.MAIN, {
                        items: buildItems(data, pathName)
                    });
                        
                    className = ' menu-submenu';
                    attribute = ' ' + DATA_MENU;
                }
                    
                if (Options.icon) {
                    nameIcon    = name
                        .replace(/\(|\)/g, '')
                        .replace(/\s/g, '-')
                        .toLowerCase();
                        
                    className  += ' icon icon-' + nameIcon;
                }
                    
                if (Options.keys) {
                    key = Options.keys[name];
                        
                    if (key)
                        attribute = ' ' + Data_KEY + key;
                }
                    
                items += rendy(TEMPLATE.ITEM, {
                    name        : name,
                    subitems    : subitems,
                    className   : className,
                    attribute   : attribute,
                    path        : pathName
                });
            });
                
            return items;
        };
        
        items = buildItems(menuData);
        
        menu = document.createElement('ul');
        menu.setAttribute('data-name', 'js-menu');
        menu.className  = 'menu menu-hidden';
        menu.innerHTML  = items;
        
        Element.appendChild(menu);
        
        return menu;
    }
    
    this.show   = showMenuElement;
    this.hide   = hideMenuElement;
    
    function checkElement(target, position) {
        let element = ElementFuncs.getItem(target);
        let isName = ElementFuncs.isName(element);
        let isItem = ElementFuncs.isItem(element);
        let isSub = ElementFuncs.isSubMenu(element);
        
        if (!isName || !isItem) {
            element = document.elementFromPoint(position.x, position.y);
            isSub   = ElementFuncs.isSubMenu(element);
            isName  = ElementFuncs.isName(element);
            isItem  = ElementFuncs.isItem(element);
        }
        
        return  {
            name    : isName,
            item    : isItem,
            sub     : isSub,
        };
    }
    
    function onClick(event, checkResult) {
        const afterClick  = Options.afterClick;
        const beforeClick = Options.beforeClick;
        const name = Options.name;
        
        const element = event.target;
        const is = checkResult || checkElement(element, {
            x: event.clientX,
            y: event.clientY
        });
        
        const notClick = exec(beforeClick, name);
        
        if (is.sub)
            return event.preventDefault();
        
        hideMenuElement();
        
        if (!notClick && (is.name || is.item)) {
            const itemData = getMenuItemData(element);
            exec(itemData);
            exec(afterClick);
        }
    }
    
    function onContextMenu(event) {
        event.preventDefault();
        
        const element = event.target;
        const x = event.clientX;
        const y = event.clientY;
        const is = checkElement(element, {
            x,
            y,
        });
        
        if (is.name || is.item || is.sub)
            return onClick(event, is);
        
        hideMenuElement();
        showMenuElement(x, y);
    }
    
    function setMenuPosition(x, y) {
        const isNumberX = typeof x === 'number';
        const isNumberY = typeof y === 'number';
        const heightMenu = getMenuHeight();
        const widthMenu = getMenuWidth();
        const heightInner = window.innerHeight;
        const widthInner = window.innerWidth;
        
        if (widthInner < widthMenu + x) {
            x -= widthMenu;
            
            if (x < 0)
                x = 0;
        }
        
        if (heightInner < heightMenu + y) {
            y -= heightMenu;
            
            if (y < 0)
                y = 0;
        }
        
        if (isNumberX)
            ElementMenu.style.left  = x + 'px';
        
        if (isNumberY)
            ElementMenu.style.top   = y - 14 + 'px';
    }
    
    function showMenuElement(x, y) {
        const {
            name,
            beforeShow,
        } = Options;
        
        const params = {
            x       : x,
            y       : y,
            name    : name
        };
        
        const notShow = exec(beforeShow, params);
        
        if (!notShow) {
            ElementMenu.classList.remove('menu-hidden');
            setMenuPosition(params.x, params.y);
        }
    }
    
    function hideMenuElement() {
        let notHide = exec(Options.beforeClose);
        
        if (!notHide)
            ElementMenu.classList.add('menu-hidden');
    }
    
    function getMenuItemData(element) {
        let path;
        
        element = ElementFuncs.getName(element);
        
        if (element)
            path = element.getAttribute('data-menu-path');
        
        return MenuFuncs[path];
    }
    
    function getMenuHeight() {
        if (!ElementHeight) {
            const styleComputed = getComputedStyle(ElementMenu);
            const height = styleComputed.height;
            
            ElementHeight = parseInt(height, 10);
        }
        
        return ElementHeight;
    }
    
    function getMenuWidth() {
        let styleComputed, width;
        
        if (!ElementWidth) {
            styleComputed   = getComputedStyle(ElementMenu);
            width           = styleComputed.width;
            
            ElementWidth    = parseInt(width, 10);
        }
        
        return ElementWidth;
    }
    
    init();
}

function ElementFuncsProto() {
    this.getItem    = getItem;
    this.getName    = getName;
    this.isName     = isName;
    this.isItem     = isItem;
    this.isMenu     = isMenu;
    this.isSubMenu  = isSubMenu;
     
    function getItem(element) {
        let isNameElement;
        
        if (element) {
            isNameElement = isName(element);
            
            if (isNameElement)
                element = element.parentElement;
        }
        
        return element;
    }
    
    function getName(element) {
        if (element) {
            const is = isName(element);
            
            if (!is)
                element = element.querySelector('[data-menu-path]');
        }
        
        return element;
    }
    
    function isName(element) {
        if (!element)
            return;
        
        return element.hasAttribute('data-menu-path');
    }
    
    function isItem(element) {
        return checkElementsName(element, 'js-menu-item');
    }
    
    function isMenu(element) {
        return checkElementsName(element, 'js-menu');
    }
    
    function checkElementsName(element, nameElement, attribute) {
        let itIs;
        
        if (!attribute)
            attribute = 'data-name';
        
        if (element) {
            const name = element.getAttribute(attribute);
            
            if (name === nameElement)
                itIs = true;
        }
        
        return itIs;
    }
    
    function isSubMenu(element) {
        const attribute = 'data-menu';
        const value = 'js-submenu';
        
        const item = getItem(element);
        const itIs = checkElementsName(item, value, attribute);
        
        return itIs;
    }
}

function exec(callback, ...args) {
    if (typeof callback === 'function')
        return callback(...args);
}

