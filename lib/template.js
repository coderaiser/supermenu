'use strict';

module.exports.MAIN = '<ul data-name="js-menu" class="menu menu-hidden">{{ items }}</ul>';
module.exports.ITEM = '<li data-name="js-menu-item" class="menu-item{{ className }}"{{ attribute }}>' +
    '<label data-menu-path="{{ path }}">{{ name }}</label>' +
    '{{ subitems }}' +
    '</li>';
