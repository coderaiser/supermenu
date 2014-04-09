var MenuProto, Util;

(function (window) {
    'use strict';
    
    MenuProto = function(element, menuData) {
        var ElementMenu,
            Element,
            ElementEvent,
            MenuFuncs       = {},
            MENU_ITEM_NAME  = 'js-menu-item',
            MENU_NAME       = 'js-menu',
            TEMPLATE        = {
                MAIN:   '<ul id="js-menu" class="menu menu-hidden">'                    +
                            '{{ items }}'                                               +
                        '</ul>',
                ITEM:   '<li id="js-menu-{{ name }}" class="menu-item{{ className }}" {{ attribute }}>' +
                            '<label>{{ name }}</label>'                                 +
                            '{{ subitems }}'                                            +
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
                buildItems  = function(menuData) {
                    var name, isObj, data, subitems, className, attribute,
                        items       = '';
                    
                    for (name in menuData) {
                        subitems    = '';
                        className   = '';
                        attribute   = '';
                        
                        data        = menuData[name];
                        isObj       = Util.isObject(data);
                        
                        if (isObj) {
                            subitems    = Util.render(TEMPLATE.MAIN, {
                                items: buildItems(data)
                            });
                            
                            className   = ' menu-submenu';
                            attribute   = ' data-menu=js-submenu';
                        } else {
                            MenuFuncs[name] = data;
                        }
                        
                        items       += Util.render(TEMPLATE.ITEM, {
                            'name'      : name,
                            'subitems'  : subitems,
                            'className' : className,
                            'attribute' : attribute,
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
                element = event.target,
                data    = element.getAttribute('data-menu');
            
            if (data === 'js-sumbenu') {
                event.preventDefault();
            } else {
                hideMenuElement();
                
                itemData = getMenuItemData(element);
                
                Util.exec(itemData);
            }
        }
        
        function onContextMenu(event) {
            var itemData,
                x   = event.x,
                y   = event.y;
            
            hideMenuElement();
            
            ElementMenu.style.left     = x - 5 +'.px';
            ElementMenu.style.top      = y - 5 + '.px';
            
            itemData = getMenuItemData(event.target);
            
            if (itemData)
                Util.exec(itemData);
            else
                showMenuElement();
            
            event.preventDefault();
        }
        
        function showMenuElement() {
            ElementMenu.classList.remove('menu-hidden');
        }
        
        function hideMenuElement() {
            ElementMenu.classList.add('menu-hidden');
        }
        
        function getMenuItemData(target) {
            var label, data, parent, idParent, isLabel,
                isMenuNameId, isMenuItemId;
            
            if (target) {
                parent          = target.parentElement,
                idParent        = parent && parent.id,
                isMenuItemId    = idParent === MENU_ITEM_NAME,
                isMenuNameId    = idParent === MENU_NAME,
                isLabel         = target.tagName === 'LABEL';
                
                if (isMenuItemId) {
                    data        = target.textContent;
                } else if (isMenuNameId) {
                    label       = target.querySelector('label');
                    data        = label.textContent;
                } else if(isLabel) {
                    data        = MenuFuncs[target.textContent];
                }
            }
            
            return data;
        }
        
        init();
    };
    
})(window);
