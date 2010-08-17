
/////////////// DO NOT EDIT, FILE IS GENERATED ///////////////
/*
 
  SheetScribe.js v0.0.2
 
  A CSS tokenizer written in javascript. 
 
  Copyright 2010, Francois Lafortune, quickredfox
  Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 
  Usage:
 
  #TODO 

*/
(function(window,undefined){
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
TAB = "\t",
NL = "\n",
MEDIAALL = 'all';
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
if (typeof Array.prototype.forEach != 'function') {
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
/*
    add trim() if not present in String implementation
*/
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
/*
    Counts the number of times "chr" appears in this string.
*/
if (typeof String.prototype.numOccurences !== 'function') {
    String.prototype.numOccurences = function(chr) {
        return-- (this.split(chr).length);
        // i like doing this, the -- thing.
    }
}

/*
    Data Objects.
*/
var Sheet = function(media, declarations) {
    this.media = media;
    this.rules = declarations;
    this.toString = function() {
        return this.media;
    }
    this.toCSS = function() {
        var css = ['@media ' + this.media + LCURL];
        for (var r in this.rules) css.push(this.rules[r].toCSS());
        return css.join(EMPTY) + RCURL;
    }
}
var Declaration = function(selector, properties) {
    this.selector = selector;
    this.properties = properties;
    this.toString = function() {
        return this.selector;
    };
    this.toCSS = function() {
        var css = [this.selector, LCURL];
        this.properties.forEach(function(prop) { css.push(prop.toCSS()) });
        return css.join(EMPTY) + RCURL
    }
};
var Property = function(name, valueGroups) {
    this.name = name;
    this.valueGroups = valueGroups;
    this.toString = function() {
        return this.name;
    };
    this.toCSS = function() {
        return this.name + COLON + this.valueGroups.join(COMMA) + SEMI;
    }
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
    if (!integral(css)) throw ('CSS not inegral')
    clean.RE.forEach(function(re) {
        css = css.replace(re[0], re[1]);
    })
    return css.trim();
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
    Munges the css into a structured object.
    note the pun: Quite contrary to the meaning of "munge".
*/
function munge(css, extracted, results) {
    var extracted = extracted || munge.extractMedias(css);
    results = results || {};
    extracted.forEach(function(blk, index) {
        var selectors = {};
        munge.stripCurlies(blk).match(munge.RE[0]).forEach(function(m) {
            munge.addSelector(m, selectors);
        });
        blk.match(munge.RE[1])[1].split(COMMA).forEach(function(n, i, a) {
            var name = n.trim();
            if (!results[name]) {
                results[name] = []
            };
            // parse selectors within block
            results[name].push(selectors);
        });
    })
    return results;
};
munge.RE = [
(/([^\}]+)\{([^\}])+\}/g), (/\@media([^\{]+)/), (/(\@media.+?\}\})/g)
]
/*
    Removes first and last {} from string
*/
munge.stripCurlies = function(str) {
    return str.substring(str.indexOf(LCURL) + 1, str.lastIndexOf(RCURL));
}
/*
    Grabs selector/value data from string and adds 
    as key/val on obj.
*/
munge.addSelector = function(str, obj) {
    return obj[str.substring(0, str.indexOf(LCURL))] = str.substring(str.indexOf(LCURL) + 1, str.length - 1);
}
/* 
    Extracts @media block strings and creates a @media block for 
    rules targeting "all"
*/
munge.extractMedias = function(css, defaultMedia) {
    var all = css = clean(css),
    medias = [],
    mat,
    ind,
    strt,
    end,
    blk;
    all = css.replace(munge.RE[2],
    function(m) {
        medias.push(m);
        return EMPTY
    });
    medias.push('@media ' + (defaultMedia || MEDIAALL) + LCURL + all + RCURL);
    return medias;
}
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
function tokenize(css, context, tokens) {
    var munged = (typeof css == 'string' ? munge(css) : css);
    for (var media in munged) {
        var sheet = {};
        munged[media].forEach(function(m, i, a) {
            var decl = {};
            for (var selector in m) decl[selector] = new Declaration(selector, parseProperties(m[selector]));
            munged[media] = new Sheet(name, decl);
        });
    }
    return munged;
};
/*
    Stringifies tokenized data.
*/
function stringify(tokenized) {
    var css = [],
    vals;
    for (var media in tokenized) css.push(tokenized[media].toCSS());
    return css.join(EMPTY);
};

/* 
  Allows one to parse css 
*/
function parse(css, media, processors) {
    var opts = parse.assign(arguments),
        parsables = opts.tokens[media];
    return parsables;
}
/*
 Helps parse support different argument signatures
*/
parse.assign = function(args) {
    var tokens=(typeof args[0] == 'string' ? tokenize(args[0]) : args[0]),
    media,
    processors;
    if (typeof args[1] == 'object') {
        processors = args[1];
        media = MEDIAALL;
    } else {
        processors = args[2] || {};
        media = args[1] || MEDIAALL;
    }
    return {tokens:tokens,media:media,processors:processors}
}
/*
 Pubic Interface 
*/
if (!window.SheetScribe) window.SheetScribe = {
    Version: '0.0.2',
    tokenize: tokenize,
    stringify: stringify,
    parse: parse
};
})(this);
