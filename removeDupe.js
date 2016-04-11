/**
 * Created by AbhishekK on 4/11/2016.
 */

//
//  !!! JQuery required. !!!
//
(function(name_space)
{

    var W = (window || self);
    var acutual_ns;
    try {
        acutual_ns = eval(name_space);
    } catch (e) {
        name_space = "Util";
        acutual_ns = W[name_space] = {}
    }

    function __loadAjax(src, callback, async/* optional default=false */) {
        var _xhr = new XMLHttpRequest();
        _xhr.onreadystatechange = function() {
            if (this.readyState == this.DONE || this.status == 200) {
                if (typeof callback === "function") {
                    callback(this.responseText, this.status);
                }
            }
        };
        _xhr.onerror = function() {
            console.log("error: " + this.status);
        };
        (async === undefined) && (async = false);
        _xhr.open('GET', src, async);
        _xhr.send();
    }


    // -----------------------------------------------------------------------------
    //
    //    Name space of acutual_ns.io
    //
    // -----------------------------------------------------------------------------
    function StringReader(data) {
        //private.
        this._contents = "",
            this._offset = 0,
            this._limit = 0,
            this._separater = "\n",
            this._eof = false,

            this.setContents(data);
    }
    StringReader.prototype = {
        //public
        isEOF: function isEOF() { return this._eof; },
        reset: function reset() {
            this._eof = false;
            this._offset = 0;
        },
        setContents: function(data) {
            //if(!data)
            //    throw new Error("error, data is:[" + data + "]");
            var is_empty = (data === null || !data);
            this._contents = (is_empty)? "": data;
            //this._offset = 0;
            this._limit = (is_empty)? 0: data.length;
            if (!is_empty)
                this._separater = /\r\n/g.test(data)? "\r\n": "\n";
            this.reset();
        },
        readLine: function readLine()
        {
            var contents = this._contents;
            var start = this._offset;
            var i = contents.indexOf(this._separater, start);
            if(i === -1)
            {
                if(start >= this._limit)
                    return null;
                else
                {
                    i = this._limit;    // 最後に改行文字がない.
                    this._eof = true;
                }
            }

            this._offset = i + this._separater.length;
            return contents.substring(start, i);
        }
    };

    // logs
    //        update: 2010-11-06 05:43:20        added "if(!prefix && typeo..."
    //
    function _gepwv(e, format, execludePatten)
    {
        var prop_names = _cp(e);
        var result = "";
        var regEx;
        if(execludePatten)
            regEx = new RegExp(execludePatten, "g");
        //regEx.global = true;
        //regEx.ignoreCase = false;
        //regEx.multiline = false;
        if(!format)
            format = "={V}";

        for(var i = 0; i < prop_names.length; i++) {
            var prop = prop_names[i];
            if(execludePatten && regEx.test(prop)) //prop.match(regEx)
                continue;

            var v = prop;
            //var o = eval("e[" + prop + "]");
            var o = e[ prop ];    // [2010-11-26 11:00:38] TODO: o is object のとき gepwv を call.
            var value = (typeof(o) === "function")? o.toString(): o;
            result += v + format.replace("V", value) + "\n";
        }

        return result;
    };
    /* [IE, NN6] */
    //
    // @param e :an object (any
    // @param type :result of "typeof" expression. ex: "string", "object", "number"...
    // @param b_sort :Specify whether to sort
    //
    function _cp(e, type, b_sort)
    {
        var i = 0;
        var arry = [];//new Array(30);    // allocate 30 slot
        if(type && typeof type === "string") {
            for(var x in e)
                if(typeof e[x] === type)
                    arry[i++] = x;
        }
        else {
            for(var x in e)
                arry[i++] = x;
        }
        if(b_sort)
            arry.sort();
        //arry.join("\n");
        return arry;
    };



    /**
     *    char[] char_table の start offset から limit offset 以下未満 の character に
     *    char ch が含まれているか check.
     */
    function checkContained(/*char[]*/ char_table, /*int*/ start, /*int*/ limit, /*char*/ ch)
    {
        for(; start < limit; start++)
            if ( char_table[start] === ch )
                break;

        return (start === limit)? false: true;
    }
    function isContinue(/*char[]*/ line)
    {
        var slashCount = 0;
        var index = line.length - 1;
        while((index >= 0) && (line[index--] === '\\'))
            slashCount++;

        return (slashCount % 2 === 1);
    }

    // version 1.2
    // support Unicode escape sequense.
    // support CR, LF, TAB, ...
    function stripEscape(contents, escapeChar)
    {
        var limit;
        if( (limit = contents.length) === 0 )
            return "";

        var i = 0, result = "";
        do {
            var c = contents[i];
            /* escapeChar であるとき, 次の文字を読む. */
            if(c === escapeChar)
            {
                if(++i === limit)    /* [2010-12-03 19:43:25] bug fix dust of "undefined" */
                    break;
                var sign = contents[i];
                if(sign === 'u')    /* Meaning UniCode escape seqence. (digit is HEX)*/
                {                // 'u' 以降の 4 文字は必ず "0123456789ABCDEFabcdef" である必要がある.
                    var l_shift = 12;
                    var uni_number = 0;
                    do {
                        /*int*/ var ch = contents[++i].charCodeAt(0); //"test".charCodeAt(0);
                        if( (ch & 0x30) === 0x30)    // >> String.fromCharCode(0x30) -> '0'
                            ch -= 48;
                        else if( (ch & 0x60) === 0x60)    /* for lower case character... */
                            ch -= 87;
                        else                            /* for upper case character... */
                            ch -= 55;

                        uni_number |= ch << l_shift;
                        l_shift -= 4;
                    } while (l_shift >= 0);

                    c = String.fromCharCode(uni_number);//(char)uni_number;
                }
                else {
                    if (sign === 't') c = '\t';
                    else if (sign === 'r') c = '\r';
                    else if (sign === 'n') c = '\n';
                    else if (sign === 'f') c = '\f';
                    else c = sign;
                }
            }
            result += c;
        } while (++i < limit);

        return result;
    }

    // 2014-06-06 20:30:20 implement.
    /**
     * if navigator.language undefined then return null
     */
    function solvePath(url)
    {
        var lang = navigator.language;
        if (!lang)
            return null;

        var x = url.lastIndexOf(".");
        (x === -1) && (x = url.length);
        return url.substring(0, x) + "_" + lang + url.substring(x);
    }


    // SEPARATE CHARS range    { 0, 9 };
    /*char[]*/
//    var SEPARATE_CHARS = "=: \t\r\n\f#!";//.toCharArray();

    //
    //    resource が大量になる場合の使用がおすすめ.
    //
    // [2010-11-20 04:37:25] version 1.0 release.
    //
    //
    function Properties(load_additional)
    {
        // private.
        this._kv = {}; /* key and value cache. */
        this._sw = new acutual_ns.Stopwatch()
        this._loaded = false;
        this._loaded_additional = false;

        this._must_load_additional = load_additional;

        // public.
        this.statistics = "";
//        this.locale = navigator.language;

        this.size = function size() {
            return acutual_ns.eps(this._kv);
        };
        this.clear = function clear() {
            delete this._kv;
            this._kv = {};
            this.statistics = "";
            // [2010-12-05 13:44:12] SeeTo: #isLoaded()
            this._loaded = false;
            this._loaded_additional = false;
        };

        // prop.loadAjax("script/external/escape-test.properties");
        //
        // @see #isLoaded()
        //
        this.loadAjax = function loadAjax(url, async)
        {
            // XMLHttpRequest object を使うこの関数はこの場合 UTF-8 encode としておけば
            // 正しく decode 表示される.(?) [2010-11-06 11:09:45] sjis などは文字化け
            var _this = this;
            /*jQuery.get(
             url, null, function(responseText, status, xhr) {
             if(status === "success") {
             _this.parse( (responseText) );
             }
             else alert("Error Properties.load: " + status);
             });*/
            function prop_load_done(responseText, status) {
                if(status === 200) {
                    _this.parse( (responseText) );
                    if (_this._must_load_additional) {
                        var additional_url = solvePath(url);
                        if (!_this._loaded_additional && additional_url !== null) {
                            _this._loaded_additional = true;
                            __loadAjax(additional_url, prop_load_done, async);
                        }
                    }
                }
                else console.log("Error Properties.load: " + status);
            };
            __loadAjax(url, prop_load_done, async);
        };

        /**
         * @param contents the properties as text.
         */
        this.parse = function parse(contents)
        {
            var is = new StringReader(contents), cb = "",
                sep_chars = "=: \t\r\n\f#!", line;

            this._sw.start();
            //while ( !is.isEOF() )    /* [2010-11-25 09:25:56] */
            while ( (line = is.readLine()) !== null )    // Get next line
            {
                var len = line.length;
                if (len > 0)
                {
                    // Find start of key, WHITE_SP_CHARS range { 2, 4 };
                    var keyStart;
                    for(keyStart = 0; keyStart < len; keyStart++)
                        if(    !checkContained(sep_chars, 2, 4, line[keyStart]) )
                            break;
                    // Blank lines are ignored
                    if (keyStart == len)
                        continue;

                    // Continue lines that end in slashes if they are not comments
                    var firstChar = line[keyStart];
                    if ((firstChar !== '#') && (firstChar !== '!'))
                    {
                        cb = line;
                        if (isContinue(line))
                        {
                            var nextLine;
                            do {
                                //cb.seek(-1, false);
                                var li_cache = cb.length - 1;
                                nextLine = is.readLine();
                                /* !CHECK: 2004-03-19 00:08:47 */
                                if(nextLine === null || nextLine.length === 0)
                                    break;
                                // Advance beyond whitespace on new line,  WHITE_SP_CHARS range { 2, 4 };
                                var startIndex = 0;
                                for(; startIndex < nextLine.length; startIndex++)
                                    if(
                                        !checkContained(sep_chars, 2, 4, nextLine[startIndex])
                                    ) break;

                                cb = cb.substring(0, li_cache) + nextLine.substring(startIndex, nextLine.length);
                            } while (isContinue(nextLine));
                        }

                        // Find separation between key and value
                        len = cb.length;
                        /*char[]*/var perfectLine = cb;//.getValues(false);
                        var separatorIndex = keyStart;
                        // KEY_VALUE_SEPARATORS range { 0, 4 };
                        for(; separatorIndex < len; separatorIndex++)
                        {
                            var c = perfectLine[separatorIndex];
                            if (c === '\\')
                                separatorIndex++;
                            else if( checkContained(sep_chars, 0, 7, c) )
                                break;
                        }

                        // Skip over whitespace after key if any, WHITE_SP_CHARS range { 2, 4 };
                        var valueIndex = separatorIndex;
                        for (; valueIndex < len; valueIndex++)
                            if(    !checkContained(sep_chars, 2, 4, perfectLine[valueIndex]))
                                break;

                        // Skip over one non whitespace key value separators if any
                        // strictKeyValueSeparators range    { 0, 2 };
                        // If perfectLine[valueIndex] is "=" or ":"...
                        if (valueIndex < len)
                            if(    checkContained(sep_chars, 0, 2, perfectLine[valueIndex]) )
                                valueIndex++;

                        // Skip over white space after other separators if any
                        while (valueIndex < len)
                        {    // WHITE_SP_CHARS range    { 2, 4 };
                            if( !checkContained(sep_chars, 2, 4, perfectLine[valueIndex]) )
                                break;
                            valueIndex++;
                        }

                        var key = cb.substring(keyStart, separatorIndex);
                        var value = (separatorIndex < len) ? cb.substring(valueIndex, len) : "";
                        // Convert then store key and value
                        this.put
                        (
                            stripEscape(key, '\\'), stripEscape(value, '\\')
                        );
                        /*this.put(key, value);*/

                        cb = "";
                    } //if ((firstChar !== '#') && (firstChar !== '!'))
                }
            }    // --------- while ( (line = is.readLine()) != null )
            this._sw.stop();

            this.statistics = "time spent(ms): " + this._sw.getResult();
            this._loaded = true;
        };
        return this;
    };

    Properties.prototype =
    {
        /**
         * Returns an enumeration of all the keys in this property list,
         * including distinct keys in the default property list if a key
         * of the same name has not already been found from the main
         * properties list.
         *
         * @return  an enumeration of all the keys in this property list, including
         *          the keys in the default property list.
         */
        propertyNames:  function propertyNames() {
            /* [2010-12-05 12:28:24] TODO
             これは timer にしても意図した挙動にならないだろう...
             またの機会に...
             var ret = null;
             if(!this._loaded)
             {
             var _this = this;
             do {
             function _dl() {
             if(_this._loaded)
             ret = acutual_ns.cp(_this._kv);
             else
             setTimeout(this, 500);
             };
             setTimeout(_dl, 500);
             } while (ret === null);
             }
             else
             ret = acutual_ns.cp(this._kv);
             return ret;*/
            return _cp(this._kv);
        },
        // @return string, <key>={<value>}
        list:  function list()
        {
            return _gepwv(this._kv, "", "", "", "=V");
        },
        // note: 2014-06-08 14:38:20
        // eval で評価すれば \uxxxx は解除されるが, ほとんどの case で error となる.
        put:  function put(key, value) {
            //value = eval(value);
            //this._kv[key] = value;
            this._kv[key] = value;
        },
        get:  function get(key) {
            var v = this._kv[key];
            //return (v === undefined)? null: v;
            return (!v)? null: v;
        },
        /**
         * @see this#getProperty
         */
        setProperty:  function setProperty(/*String*/ key, /*String*/ value) {
            return this.put(key, value);
        },
        /**
         *
         * @param   key            the hashtable key.
         * @param   defaultValue   a default value.
         *
         * @return  the value in this property list with the specified key value.
         * @see     #setProperty
         */
        getProperty:  function getProperty(key, defaultValue) {
            var val = this.get(key);
            return (val === null) ? defaultValue : val;
        },
        // [2010-12-05 13:42:51] added.
        isLoaded: function() { return this._loaded; }
    }

    $.extend(acutual_ns, {
        Properties: Properties,
        StringReader: StringReader
    });

})("Util");	// (function()

