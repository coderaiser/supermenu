var MenuProto, Util;

(function(scope) {
    'use strict';
    
    var Scope = scope.window ? window : global;
    
    if (typeof module === 'object' && module.exports)
        module.exports = new UtilProto();
    else if (!Scope.Util)
        Scope.Util = new UtilProto();
    
    function UtilProto() {
        var Util = this;
        
        /**
         * function do save exec of function
         * @param pCallBack
         * @param pArg1
         * ...
         * @param pArgN
         */
        this.exec                       = function(callback) {
            var ret,
                args    = Util.slice(arguments, 1);
           
            if (Util.isFunction(callback))
                ret     = callback.apply(null, args);
            
            return ret;
        };
        
        /**
         * functions check is pVarible is pType
         * @param pVarible
         * @param pType
         */    
        this.isType                 = function(pVarible, pType) {
            return typeof pVarible === pType;
        };
        
        /**
         * functions check is pVarible is function
         * @param pVarible
         */
        this.isFunction             = function(pVarible) {
            return Util.isType(pVarible, 'function');
        };
        
         /**
         * functions check is pVarible is object
         * @param pVarible
         */
        this.isObject               = function(pVarible) {
            return Util.isType(pVarible, 'object');
        };
        
        /**
         * function makes new array based on first
         * 
         * @param array
         */
        this.slice                  = function(array, count) {
            var ret;
            
            if (array)
                ret = [].slice.call(array, count);
            
            return ret;
        };
        
        /**
         * function render template with view
         * @templ
         * @view
         */
        this.render                  = function(templ, view) {
            var ret,
                NOT_ESCAPE  = true,
                SPACES      = '\\s*',
                symbols     = ['{{' + SPACES, SPACES + '}}'];
            
            ret = Util.ownRender(templ, view, symbols, NOT_ESCAPE);
                    
            return ret;
        };
        
        /**
         * function render template with view and own symbols
         * @templ
         * @view
         * @symbols
         */
        this.ownRender                  = function(templ, view, symbols, notEscape) {
            var str, param, expr,
                ret         = templ,
                firstChar,
                secondChar;
                
            firstChar   = symbols[0];
            secondChar  = symbols[1]  || firstChar;
            
            for (param in view) {
                str     = view[param];
                str     = Util.exec(str) || str;
                expr    = firstChar + param + secondChar;
                ret     = Util.replaceStr(ret, expr, str, notEscape);
            }
            
            expr        = firstChar + '.*' + secondChar;
            ret         = Util.replaceStr(ret, expr, '', notEscape);
            
            return ret;
        };
        
        /**
         * function replase pFrom to pTo in pStr
         * @pStr
         * @pFrom
         * @pTo
         * @pNotEscape
         */
        this.replaceStr             = function(pStr, pFrom, pTo, pNotEscape) {
            var lRet = pStr;
            
            if (pStr && pFrom) {
                if (!pNotEscape)
                    pFrom = Util.escapeRegExp(pFrom);
                
                lRet = pStr.replace(new RegExp(pFrom, 'g'), pTo);
            }
           
           return lRet;
        };
        
        this.escapeRegExp = function(pStr) {
            var lRet    = pStr,
                isStr   = Util.isString(pStr);
            
            if (isStr)
                lRet = pStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            
            return lRet;
        };
    }
})(this);


(function (window) {
    'use strict';
    
    MenuProto = function(element, menuData) {
        var ElementMenu,
            Element,
            ElementFuncs    = new ElementFuncsProto(),
            ElementEvent,
            MenuFuncs       = {},
            TEMPLATE        = {
                MAIN:   '<ul id="js-menu" class="menu menu-hidden">'                                    +
                            '{{ items }}'                                                               +
                        '</ul>',
                ITEM:   '<li id="js-menu-{{ name }}" class="menu-item{{ className }}"{{ attribute }}>'  +
                            '<label data-menu-path={{ path }}>{{ name }}</label>'                                      +
                            '{{ subitems }}'                                                            +
                        '</li>'
            };
        
        if (menuData) {
            Element         =
            ElementEvent    = element;
        } else {
            Element         = document.body;
            ElementEvent    = window;
            menuData        = element;
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
                    var name, isObj, data, subitems, className, attribute, pathName,
                        DATA_MENU   = 'data-menu="js-submenu"',
                        items       = '';
                    
                    if (path)
                        path        += '.';
                    else
                        path        = '';
                    
                    for (name in menuData) {
                        subitems    = '';
                        className   = '';
                        attribute   = '';
                        pathName    = path + name;
                        
                        data        = menuData[name];
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
                        
                        items           += Util.render(TEMPLATE.ITEM, {
                            name        : name,
                            subitems    : subitems,
                            className   : className,
                            attribute   : attribute,
                            path        : pathName
                        });
                    }
                    
                    return items;
                };
            
            items = buildItems(menuData);
            
            menu = Util.render(TEMPLATE.MAIN, {
                items: items
            });
            
            Element.innerHTML   += menu;
            elementMenu         = Element.querySelector('#js-menu');
            
            return elementMenu;
        }
        
        this.show   = showMenuElement;
        this.hide   = hideMenuElement;
        
        function onClick(event) {
            var itemData,
                element = ElementFuncs.getItem(event.target),
                isSub   = ElementFuncs.isSubMenu(element);
            
            if (isSub) {
                event.preventDefault();
            } else {
                hideMenuElement();
                
                itemData = getMenuItemData(element);
                
                Util.exec(itemData);
            }
        }
        
        function onContextMenu(event) {
            var itemData, isName,
                element = event.target,
                x       = event.x,
                y       = event.y;
            
            hideMenuElement();
            
            ElementMenu.style.left     = x - 5 +'.px';
            ElementMenu.style.top      = y - 5 + '.px';
            
            
            isName = ElementFuncs.isName(element);
                
            if (isName) {
                itemData = getMenuItemData(element);
            
                if (itemData)
                    Util.exec(itemData);
            } else
                showMenuElement();
            
            event.preventDefault();
        }
        
        function showMenuElement() {
            ElementMenu.classList.remove('menu-hidden');
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
        
        init();
    };
    
    function ElementFuncsProto() {
        this.getItem    = getItem;
        this.getName    = getName;
        this.isName     = isName;
        this.isSubMenu  = isSubMenu;
         
         function getItem(element) {
            var isNameElement;
            
            if (element) {
                isNameElement = isName(element);
                
                if (isName)
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
        
        function isSubMenu(element) {
            var data, isSub,
                DATA    = 'data-menu',
                VALUE   = 'js-submenu';
            
            if (element) {
                data    = element.getAttribute(DATA),
                isSub   = data === VALUE;
            }
            
            return isSub;
        }
    }
    
    
})(window);
