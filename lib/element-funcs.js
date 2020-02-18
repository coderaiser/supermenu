'use strict';

module.exports = class ElementFuncsProto {
    getItem(element) {
        if (this.isName(element))
            return element.parentElement;
        
        return element;
    }
    
    getName(element) {
        if (!element)
            return null;
        
        if (this.isName(element))
            return element;
        
        return element.querySelector('[data-menu-path]');
    }
    
    isName(element) {
        if (!element)
            return false;
        
        return element.hasAttribute('data-menu-path');
    }
    
    isItem(element) {
        return this.checkElementsName(element, 'js-menu-item');
    }
    
    isMenu(element) {
        return this.checkElementsName(element, 'js-menu');
    }
    
    checkElementsName(element, nameElement, attribute) {
        if (!attribute)
            attribute = 'data-name';
        
        if (element) {
            const name = element.getAttribute(attribute);
            
            if (name === nameElement)
                return true;
        }
        
        return false;
    }
    
    isSubMenu(element) {
        const attribute = 'data-menu';
        const value = 'js-submenu';
        const item = this.getItem(element);
        
        return this.checkElementsName(item, value, attribute);
    }
};

