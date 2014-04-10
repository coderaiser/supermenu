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
         * functions check is variable is pType
         * @param variable
         * @param pType
         */    
        this.isType                 = function(variable, pType) {
            return typeof variable === pType;
        };
        
        /**
         * functions check is variable is function
         * @param variable
         */
        this.isFunction             = function(variable) {
            return Util.isType(variable, 'function');
        };
        
         /**
         * functions check is variable is object
         * @param variable
         */
        this.isObject               = function(variable) {
            return Util.isType(variable, 'object');
        };
        
        /**
         * functions check is variable is number
         * @param variable
         */
        this.isNumber               = function(variable) {
            return Util.isType(variable, 'number');
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
