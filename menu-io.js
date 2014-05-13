var MenuIO, Util;

(function (window) {
    'use strict';
    
    MenuIO = function(element, options, menuData) {
        if (!(this instanceof MenuIO)) {
            return new MenuIO(element, options, menuData);
        }
        
        var ElementMenu,
            Element,
            Options,
            ElementFuncs    = new ElementFuncsProto(),
            ElementHeight,
            ElementEvent,
            MenuFuncs       = {},
            TEMPLATE        = {
                MAIN:   '<ul data-name="js-menu" class="menu menu-hidden">'                             +
                            '{{ items }}'                                                               +
                        '</ul>',
                ITEM:   '<li data-name="js-menu-item" class="menu-item{{ className }}"{{ attribute }}>'  +
                            '<label data-menu-path={{ path }}>{{ name }}</label>'                       +
                            '{{ subitems }}'                                                            +
                        '</li>'
            };
        
        if (menuData) {
            Element         =
            ElementEvent    = element;
            Options         = options;
        } else if (options) {
            Element         = element;
            menuData        = options;
        } else {
            Element         = document.body;
            ElementEvent    = window;
        }
        
        function init() {
            var name, isObj = Util.isObject(menuData);
            
            if (!isObj) {
                name            = menuData;
                menuData        = {};
                menuData[name]  = null;
            }
            
            ElementMenu         = createMenu(menuData);
            
            ElementEvent.addEventListener('click', onClick);
            ElementEvent.addEventListener('contextmenu', onContextMenu);
        }
        
        function createMenu(menuData) {
            var elementMenu,
                menu        = '',
                items       = '',
                buildItems  = function(menuData, path) {
                    var DATA_MENU   = 'data-menu="js-submenu"',
                        items       = '';
                    
                    if (path)
                        path        += '.';
                    else
                        path        = '';
                    
                    Object.keys(menuData).forEach(function(name) {
                        var subitems    = '',
                            className   = '',
                            attribute   = '',
                            pathName    = path + name,
                            
                            data        = menuData[name],
                            isObj       = Util.isObject(data);
                        
                        if (!isObj) {
                            MenuFuncs[pathName] = data;
                        } else {
                            subitems    = Util.render(TEMPLATE.MAIN, {
                                items: buildItems(data, pathName)
                            });
                            
                            className   = ' menu-submenu';
                            attribute   = ' ' + DATA_MENU;
                        }
                        
                        if (Options && Options.icon)
                            className += ' icon icon-' + name;
                        
                        items           += Util.render(TEMPLATE.ITEM, {
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
            
            menu = Util.render(TEMPLATE.MAIN, {
                items: items
            });
            
            Element.innerHTML   += menu;
            elementMenu         = Element.querySelector('[data-name="js-menu"]');
            
            return elementMenu;
        }
        
        this.show   = showMenuElement;
        this.hide   = hideMenuElement;
        
        function checkElement(target, position) {
            var is,
                element = ElementFuncs.getItem(target),
                isName  = ElementFuncs.isName(element),
                isItem  = ElementFuncs.isItem(element),
                isSub   = ElementFuncs.isSubMenu(element);
            
            if (!isName || !isItem) {
                element = document.elementFromPoint(position.x, position.y);
                isSub   = ElementFuncs.isSubMenu(element);
                isName  = ElementFuncs.isName(element);
                isItem  = ElementFuncs.isItem(element);
            }
            
            is = {
                name    : isName,
                item    : isItem,
                sub     : isSub,
            };
            
            return is;
        }
        
        function onClick(event, checkResult) {
            var itemData,
                element     = event.target,
                is          = checkResult || checkElement(element, {
                    x: event.clientX,
                    y: event.clientY
                });
                
            if (is.sub) {
                event.preventDefault();
            } else {
                hideMenuElement();
                
                if (is.name || is.item) {
                    itemData = getMenuItemData(element);
                    Util.exec(itemData);
                }
            }
        }
        
        function onContextMenu(event) {
            var element = event.target,
                x       = event.clientX,
                y       = event.clientY,
                is      = checkElement(element, {
                    x: x,
                    y: y
                });
            
            if (is.name || is.item || is.sub)
                onClick(event, is);
            else
                showMenuElement(x, y);
            
            event.preventDefault();
        }
        
        function setMenuPosition(x, y) {
            var isNumberX   = Util.isNumber(x),
                isNumberY   = Util.isNumber(y),
                heightMenu  = getMenuHeight(),
                heightInner = window.innerHeight;
            
            if (heightInner < heightMenu + y)
                y -= heightMenu;
            
            if (isNumberX)
                ElementMenu.style.left  = x + 'px';
            
            if (isNumberY)
                ElementMenu.style.top   = y - 15 + 'px';
        }
        
        function showMenuElement(x, y) {
            ElementMenu.classList.remove('menu-hidden');
            setMenuPosition(x, y);
        }
        
        function hideMenuElement() {
            ElementMenu.classList.add('menu-hidden');
        }
        
        function getMenuItemData(element) {
            var path, data;
            
            element     = ElementFuncs.getName(element);
            
            if (element) {
                path    = element.getAttribute('data-menu-path');
            }
            
            data        = MenuFuncs[path];
            
            return data;
        }
        
        function getMenuHeight() {
            var styleComputed, height;
            
            if (!ElementHeight) {
                styleComputed   = getComputedStyle(ElementMenu);
                height          = styleComputed.height;
                ElementHeight   = parseInt(height, 10);
            }
                
            return ElementHeight;
        }
        
        init();
    };
    
    function ElementFuncsProto() {
        this.getItem    = getItem;
        this.getName    = getName;
        this.isName     = isName;
        this.isItem     = isItem;
        this.isMenu     = isMenu;
        this.isSubMenu  = isSubMenu;
         
         function getItem(element) {
            var isNameElement;
            
            if (element) {
                isNameElement = isName(element);
                
                if (isNameElement)
                    element = element.parentElement;
            }
            
            return element;
        }
        
        function getName(element) {
            var is;
            
            if (element) {
                is = isName(element);
                
                if (!is)
                    element = element.querySelector('[data-menu-path]');
            }
            
            return element;
        }
        
        function isName(element) {
            var itIs;
            
            if (element)
                itIs = element.hasAttribute('data-menu-path');
            
            return itIs;
        }
        
        function isItem(element) {
            var itIs = checkElementsName(element, 'js-menu-item');
            
            return itIs;
        }
        
        function isMenu(element) {
            var itIs = checkElementsName(element, 'js-menu');
            
            return itIs;
        }
        
        function checkElementsName(element, nameElement, attribute) {
            var itIs, name;
            
            if (!attribute)
                attribute = 'data-name';
            
            if (element) {
                name = element.getAttribute(attribute);
                
                if (name === nameElement)
                    itIs = true;
            }
            
            return itIs;
        }
        
        function isSubMenu(element) {
            var itIs, item,
                attribute   = 'data-menu',
                value       = 'js-submenu';
            
            item    = getItem(element);
            itIs    = checkElementsName(item, value, attribute);
            
            return itIs;
        }
    }
    
    
})(window);