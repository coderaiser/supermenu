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
           
            if (Util.type.function(callback))
                ret     = callback.apply(null, args);
            
            return ret;
        };
        
        this.type                   = new TypeProto();
        
        function TypeProto() {
            /**
             * get type of variable
             * 
             * @param variable
             */
            function type(variable) {
                var regExp      = new RegExp('\\s([a-zA-Z]+)'),
                    str         = {}.toString.call(variable),
                    typeBig     = str.match(regExp)[1],
                    result      = typeBig.toLowerCase();
                
                return result;
            }
            
            /**
             * functions check is variable is array
             * @param variable
             */
            type.array          = function(variable) {
                var result;
                
                if (Array.isArray)
                    result = Array.isArray(variable) ;
                else
                    result = type(variable) === 'array';
                
                return result;
            };
            
            /**
             * functions check is variable is arrayBuffer
             * @param variable
             */
            type.arrayBuffer    = function(variable) {
                return type(variable) === 'arraybuffer';
            };
            
            /**
             * functions check is variable is boolean
             * @param variable
             */
            type.boolean               = function(variable) {
                return typeof variable === 'boolean';
            };
            
            /**
             * functions check is variable is function
             * @param variable
             */
            type.function               = function(variable) {
                return typeof variable === 'function';
            };
            
            /**
             * functions check is variable is number
             * @param variable
             */
            type.number               = function(variable) {
                return typeof variable === 'number';
            };
            
            /**
             * functions check is variable is object
             * @param variable
             */
            type.object               = function(variable) {
                var type    = Util.type(variable),
                    is      = type === 'object';
                
                return is;
            };
            
            /**
             * functions check is variable is string
             * @param variable
             */
            type.string               = function(variable) {
                return typeof variable === 'string';
            };
            
            /**
             * functions check is variable is string
             * @param variable
             */
            type.undefined            = function(variable) {
                return typeof variable === 'undefined';
            };
            
            /**
             * functions check is variable is File
             * @param variable
             */
            type.file                 = function(variable) {
                var FILE = '[object File]',
                    name, is;
                
                name    = Util.exec.ifExist(variable, 'toString');
                
                is      = name === FILE;
                
                return is;
            };
            
            return type;
        }
        
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
            var regExp,
                isStr   = Util.type.string(str);
            
            if (isStr && from) {
                if (!notEscape)
                    from = Util.escapeRegExp(from);
                
                regExp  = new RegExp(from, 'g');
                str     = str.replace(regExp, to);
            }
           
           return str;
        };
        
        /**
         * function remove substring from string
         * @param str
         * @param substr
         */
        this.rmStr                  = function(str, substr, isOnce) {
            var replace,
                strArray    = [],
                isString    = Util.type.string(str),
                isArray     = Util.type.array(substr),
                replaceStr  = function(str, strItem) {
                    var ret = str.replace(strItem, '');
                    
                    return ret;
                };
            
            replace         = isOnce ? replaceStr : Util.replaceStr;
            
            if (isString && substr)  {
                if (isArray)
                    strArray = substr;
                else
                    strArray.push(substr);
                
                strArray.forEach(function(strItem) {
                    str = replace(str, strItem, '');
                });
            }
            
            return str;
        };
        
        this.escapeRegExp = function(pStr) {
            var lRet    = pStr,
                isStr   = Util.type.string(pStr);
            
            if (isStr)
                lRet = pStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            
            return lRet;
        };
        
        /**
         * function convert name: rm: '(, ), -, " "'
         * 
         * @name
         * convert 
         */
        this.convertName            = function(name) {
            var conv = name && name.toLowerCase();
            
            conv    = Util.rmStr(conv, ['(', ')']);
            conv    = Util.replaceStr(conv, ' ', '-');
            
            return conv;
        };
    }
})(this);
