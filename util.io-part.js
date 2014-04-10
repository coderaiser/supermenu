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
