/*
    A tiny tiny bit faster.
*/
var FMATCH = "$1",
LCURL = '{',
RCURL = '}',
DRCURL = '}}',
EMPTY = '',
COLON = ':',
SEMI = ';',
SPC = ' ',
COMMA = ',',
TAB="\t",
NL="\n";
/*
    Sake of convenience...
*/
var log = function() {
    if (window.console) return window.console.log.apply(null, arguments);
    var __noop = function() {};
    window.console = {
        info: __noop,
        log: __noop,
        debug: __noop
    };
    return arguments;
}
/*
    Add forEach if not present in Array implementation.
*/
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun
    /*, thisp*/
    ) {
        var len = this.length >>> 0;
        if (typeof fun != "function") throw new TypeError();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) fun.call(thisp, this[i], i, this);
        }
    };
}

RegExp.customEscape = function(text) {
    if (!arguments.callee.sRE) {
        var specials = [
        '/', '.', '*', '+', '?', '|',
        '(', ')', '[', ']', '{', '}', '\\',
        '@', '^', '%', '#', '&', '$'
        ];
        arguments.callee.sRE = new RegExp(
        '(\\' + specials.join('|\\') + ')', 'g'
        );
    }
    return text.replace(arguments.callee.sRE, '\\$1');
}

/*
      Splits a string 2-ways along delimiter.
      Delimiter can be a regex or a string.
      Returns an array with [before,after]
*/
String.prototype.bisect = function(delimiter) {
    var re = new RegExp();
    var esc = RegExp.customEscape(delimiter);
    re.compile(esc + "(.+)");
    return this.split(re, 2)
};
/*
    Counts the number of times "chr" appears in this string.
*/
String.prototype.numOccurences = function(chr) {
    return--(this.split(chr).length);// i like doing this, the -- thing.
}
/*
    Data Objects.
*/
var Declaration = function(selector, properties) {
    this.selector = selector;
    this.properties = properties;
    this.toString = function() {
        return this.selector;
    };
};
var Property = function(name, groups) {
    this.name = name;
    this.groups = groups;
    this.toString = function() {
        return this.name;
    };
};
/*
    Checks integrity of stylesheet declarations.
    n.b.: Internal integrity, not http://www.w3.org/TR/CSS2/syndata.html#parsing-errors.
*/
function integral(css) {
    return css.numOccurences(LCURL) === css.numOccurences(RCURL) && !(integral.RE[0]).test(css) && !(integral.RE[1]).test(css);
}
integral.RE = [(/[\{\;]\s+?\-/g), (/filter\:/)];
/*
    Removes a bunch of stuff for ease of parsing, see clean.RE[].
    n.b.: Measured with jslitmus and this approach seems to be fastest.
*/
function clean(css) {
    clean.RE.forEach(function(re) {
        css = css.replace(re[0], re[1]);
    })
    return snip(css);
};
clean.RE = [
[(/\/\*[^*]*\*+([^\/*][^*]*\*+)*\//g), EMPTY],
// strip out comments and extra linebreaks/whitespace.
[(/([\r\n\t\s]){1,}/gm), FMATCH],
// strip out multiple whitespace.
[(/[\n\t\s\r]*([\{\;\:\}])[\n\t\s\r]*/g), FMATCH],
// strip out extra whitespace before and after curlies.
[(/([^\}\;])\}/g), FMATCH + ";}"]
// bring back optional last semicolon.
];
/* 
    Remove linebreaks/whitespace at begining and end of string. 
*/
function snip(str) {
    return str.replace(/^[\s]+|[\s]+$/g, EMPTY);
};
/* 
    Travels until "chr" within a string "str" and call "fn" with the "head" and "footer" data 
    (before and after chr) and then continues until it reaches end of string.
*/
function travel(chr, str, fn) {
    var parts = str.bisect(chr);
    fn(parts[0], parts[1]);
    if ((/\{/).test(parts[1])) {
        return travel(chr, parts[1], fn)
    }
};
/* 
    Munges the css into structured object.
    note the pun: Quite contrary to the meaning of "munge".
*/
function munge(css) {
    var selectors = [];
    if (!integral(css)) throw "CSS is not valid!";
    travel(LCURL, css,
    function(head, foot) {
        console.debug((munge.RE[0]).exec(head))
        // var selector = (munge.RE[0]).exec(head);
        //        // is it a media block?
        //        if((munge.RE[2]).test(selector[0])){
        //            // yes!
        //            var props = munge(munge.shift(foot, true));
        //            selector[0].match(munge.RE[2])[1].split(',').forEach(function(n) {
        //                selectors.push({
        //                    selector: '@media '+snip(n),
        //                    block: props
        //                })
        //                            console.debug(n,props.length)
        //            })
        //        }else{
        //            selectors.push({
        //                selector: selector[0],
        //                block: munge.shift(foot).replace(munge.RE[1], EMPTY)
        //            })
        // 
        //        }
    });
    return selectors;
};
munge.RE = [(/[^\}\{]+$/), (/\}$/),(/\@media\s?(.+)/)];
/* 
    Moves to next chunk.
*/
munge.shift = function(css, sub) {
    return css.substring(0, css.indexOf((sub ? DRCURL: RCURL))+1);
};
/*
    Parses a properties string into an object with a value groups array for each property name.
*/
function parseProperties(properties) {
    var props = [],
    name,
    colon;
    properties.split(SEMI).forEach(function(pair) {
        colon = pair.indexOf(COLON);
        if (name = pair.substring(0, colon)) {
            props.push(new Property(name, pair.substring(colon + 1).split(COMMA)))
        }
    });
    return props;
}
/*
    Tokenize the properties and munged data.
*/
var dev2 = false;
function tokenize(css, context, tokens) {
    var munged = (typeof css == 'string' ? munge(clean(css)) : css),
    declaration,
    tokenized = tokens || {};
    media = context || 'all';
    function translate(declaration) {
        if (!context && tokenize.RE[0].test(declaration.selector)){
            var m = declaration.selector.match(tokenize.RE[0])[1];
            return tokenize(declaration.block, m , tokenized);  
        };
        if (!tokenized[media]) tokenized[media] = [];
        return tokenized[media].push(new Declaration(declaration.selector, parseProperties(declaration.block)))
    }
    if(dev2) console.debug('munged',media,munged)
    munged.forEach(translate);
    if(media == 'dev2') dev2 = true;
    return tokenized;
};
tokenize.RE = [(/\@media\s+?(\w+)?/)];
/*
    Stringifies tokenized data.
*/
function stringify(tokenized, media) {
    var css = [],vals;
    for (var media in tokenized) {
        css.push('@media ' + media + LCURL)
        tokenized[media].forEach(function(dec) {
            css.push(TAB + dec.selector + LCURL);
            dec.properties.forEach(function(prop) {
                var vals = prop.groups.join(COMMA);
                css.push([TAB,SPC,prop.name,COLON,vals,SEMI].join(EMPTY));
            });
            css.push(TAB+RCURL);
        });
        css.push(RCURL);
    };
    return css.join(NL);
};

/* 
  Allows one to parse css 
*/
function parse(css,media,processors) {
    var opts = parse.shuffleArgs(arguments);
    
}
parse.assign = function(arguments) {
    var tokens=arguments[0],media=arguments[1],processors=arguments[2];
    if(typeof tokens == 'string') tokens = tokenize(tokens);
    // if(typeof media == )
}
/*
 Pubic Interface 
*/
if (!window.SheetScribe) window.SheetScribe = {
    tokenize: tokenize,
    stringify: stringify
    //      parse: undefined yet
};
