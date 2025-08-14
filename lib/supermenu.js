'use strict';

require('../css/supermenu.css');

const createElement = require('@cloudcmd/create-element');
const buildItems = require('./build-items');
const ElementFuncsProto = require('./element-funcs');

const isNumber = (a) => typeof a === 'number';
const exec = (f, ...a) => f?.(...a);

module.exports = Supermenu;

function Supermenu(element, options, menuData) {
    if (!(this instanceof Supermenu))
        return new Supermenu(element, options, menuData);
    
    const ElementFuncs = new ElementFuncsProto();
    
    let Options = {};
    let Element;
    let ElementHeight;
    let ElementWidth;
    let ElementEvent;
    
    if (menuData) {
        Element = element;
        ElementEvent = Element;
        Options = options;
    } else if (options) {
        Element = element;
        ElementEvent = Element;
        menuData = options;
    } else {
        Element = document.body;
        ElementEvent = window;
        menuData = element;
    }
    
    const MenuFuncs = {};
    const ElementMenu = createMenu(menuData);
    
    ElementEvent.addEventListener('click', onClick);
    
    function createMenu(menuData) {
        const items = buildItems(menuData, MenuFuncs, Options);
        
        const menu = createElement('ul', {
            dataName: 'js-menu',
            className: 'menu menu-hidden',
            innerHTML: items,
            parent: Element,
            uniq: false,
        });
        
        return menu;
    }
    
    this.show = showMenuElement;
    this.hide = hideMenuElement;
    
    this.addContextMenuListener = () => {
        ElementEvent.addEventListener('contextmenu', onContextMenu);
    };
    
    this.removeContextMenuListener = () => {
        ElementEvent.addEventListener('contextmenu', onContextMenu);
    };
    
    this.remove = removeElement;
    
    function removeElement() {
        ElementEvent.removeEventListener('click', onClick);
        ElementEvent.removeEventListener('contextmenu', onContextMenu);
        
        Element.removeChild(ElementMenu);
    }
    
    function checkElement(target, position) {
        let element = ElementFuncs.getItem(target);
        let isName = ElementFuncs.isName(element);
        let isItem = ElementFuncs.isItem(element);
        let isSub = ElementFuncs.isSubMenu(element);
        
        if (!isName || !isItem) {
            element = document.elementFromPoint(position.x, position.y);
            isSub = ElementFuncs.isSubMenu(element);
            isName = ElementFuncs.isName(element);
            isItem = ElementFuncs.isItem(element);
        }
        
        return {
            name: isName,
            item: isItem,
            sub: isSub,
        };
    }
    
    function onClick(event, checkResult) {
        event.stopPropagation();
        
        const {
            afterClick,
            beforeClick,
            beforeHide,
            afterHide,
            name,
        } = Options;
        
        const element = event.target;
        
        const is = checkResult || checkElement(element, {
            x: event.clientX,
            y: event.clientY,
        });
        
        const notClick = exec(beforeClick, name);
        
        if (is.sub)
            return event.preventDefault();
        
        exec(beforeHide);
        hideMenuElement();
        exec(afterHide);
        
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
        const isNumberX = isNumber(x);
        const isNumberY = isNumber(y);
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
            ElementMenu.style.left = `${x}px`;
        
        if (isNumberY)
            ElementMenu.style.top = y - 14 + 'px';
    }
    
    function showMenuElement(x, y) {
        const {
            name,
            beforeShow,
            afterShow,
        } = Options;
        
        const params = {
            x,
            y,
            name,
        };
        
        const isShow = exec(beforeShow, params);
        
        if (isShow || isShow !== false) {
            ElementMenu.classList.remove('menu-hidden');
            setMenuPosition(params.x, params.y);
            exec(afterShow, params);
        }
    }
    
    function hideMenuElement() {
        const notHide = exec(Options.beforeClose);
        
        if (!notHide)
            ElementMenu.classList.add('menu-hidden');
    }
    
    function getMenuItemData(element) {
        const nameElement = ElementFuncs.getName(element);
        
        if (!nameElement)
            return null;
        
        const path = nameElement.getAttribute('data-menu-path');
        
        return MenuFuncs[path];
    }
    
    function getMenuHeight() {
        if (!ElementHeight) {
            const {height} = getComputedStyle(ElementMenu);
            
            ElementHeight = parseInt(height, 10);
        }
        
        return ElementHeight;
    }
    
    function getMenuWidth() {
        if (!ElementWidth) {
            const {width} = getComputedStyle(ElementMenu);
            
            ElementWidth = parseInt(width, 10);
        }
        
        return ElementWidth;
    }
}
