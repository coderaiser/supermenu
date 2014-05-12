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
         * functions check is variable is array
         * @param variable
         */
        this.isArray                = function(variable) {
            return Array.isArray(variable);
        };
        
        /**
         * functions check is variable is arrayBuffer
         * @param variable
         */
        this.isArrayBuffer          = function(variable) {
            var type    = this.getType(variable),
                is      = type === 'arraybuffer';
            
            return is;
        };
        
        /**
         * functions check is variable is boolean
         * @param variable
         */
        this.isBoolean               = function(variable) {
            return Util.isType(variable, 'boolean');
        };
        
        /**
         * functions check is variable is function
         * @param variable
         */
        this.isFunction             = function(variable) {
            return Util.isType(variable, 'function');
        };
        
        /**
         * functions check is variable is number
         * @param variable
         */
        this.isNumber               = function(variable) {
            return Util.isType(variable, 'number');
        };
        
        /**
         * functions check is variable is object
         * @param variable
         */
        this.isObject               = function(variable) {
            var type    = Util.getType(variable),
                is      = type === 'object';
            
            return is;
        };
        
        /**
         * functions check is variable is string
         * @param variable
         */
         this.isString               = function(variable) {
            return Util.isType(variable, 'string');
        };
        
        /**
         * functions check is variable is string
         * @param variable
         */
         this.isUndefined           = function(variable) {
            return Util.isType(variable, 'undefined');
        };
        
        /**
         * functions check is variable is File
         * @param variable
         */
        this.isFile                 = function(variable) {
            var FILE = '[object File]',
                name, is;
            
            name    = Util.execIfExist(variable, 'toString');
            
            is      = name === FILE;
            
            return is;
        };
        
        /**
         * functions check is variable is pType
         * @param variable
         * @param pType
         */    
        this.isType                 = function(variable, pType) {
            return typeof variable === pType;
        };
        
        /**
         * get type of variable
         * 
         * @param variable
         */
        this.getType                = function(variable) {
            var regExp      = new RegExp('\\s([a-zA-Z]+)'),
                obj         = {},
                toStr       = obj.toString,
                str         = toStr.call(variable),
                typeBig     = str.match(regExp)[1],
                type        = typeBig.toLowerCase();
            
            return type;
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
         * @param str
         * @param from
         * @param to
         * @param notEscape
         */
        this.replaceStr             = function(str, from, to, notEscape) {
            var isStr   = Util.isString(str),
                regExp  = new RegExp(from, 'g');
            
            if (isStr && from) {
                if (!notEscape)
                    from = Util.escapeRegExp(from);
                
                str = str.replace(regExp, to);
            }
           
           return str;
        };
        
        this.escapeRegExp = function(pStr) {
            var lRet    = pStr,
                isStr   = Util.isString(pStr);
            
            if (isStr)
                lRet = pStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            
            return lRet;
        };
    }
})(this);
