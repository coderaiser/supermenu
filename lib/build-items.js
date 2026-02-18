import {rendy} from 'rendy';
import TEMPLATE from './template';

const isObj = (a) => typeof a === 'object';
const DATA_MENU = 'data-menu="js-submenu"';

const {entries} = Object;

export default function buildItems(menuData, menuFuncs, options, path = '') {
    let items = '';
    
    if (path)
        path += '.';
    
    for (const [name, data] of entries(menuData)) {
        let nameIcon;
        let subitems = '';
        let className = '';
        let attribute = '';
        
        const pathName = path + name;
        
        if (!isObj(data)) {
            menuFuncs[pathName] = data;
        } else {
            subitems = rendy(TEMPLATE.MAIN, {
                items: buildItems(data, menuFuncs, options, pathName),
            });
            
            className = ' menu-submenu';
            attribute = ` ${DATA_MENU}`;
        }
        
        if (options.icon) {
            nameIcon = name
                .replace(/[()]/g, '')
                .replace(/\s/g, '-')
                .toLowerCase();
            
            className += ` icon icon-${nameIcon}`;
        }
        
        items += rendy(TEMPLATE.ITEM, {
            name,
            subitems,
            className,
            attribute,
            path: pathName,
        });
    }
    
    return items;
}
