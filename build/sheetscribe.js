
/////////////// DO NOT EDIT, FILE IS GENERATED ///////////////
/*
 
  SheetScribe.js v0.0.1
 
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
function munge(css,extracted, results) {
	var extracted = extracted||munge.extractMedias(css);
	results = results||{};
	extracted.forEach(function(blk,index) {
		var selectors = {};
		munge.stripCurlies(blk).match(/([^\}]+)\{([^\}])+\}/g).forEach(function(m) {
			munge.addSelector(m.trim(),selectors);
		});
		blk.match(/\@media([^\{]+)/)[1].split(',').forEach(function(n,i,a) {
			var name = n.trim();
			if(!results[name]){results[name]=[]};
			// parse selectors within block
			results[name].push(selectors);
		});
	})
	return results;
};
munge.stripCurlies = function(str) {
	return str.substring(str.indexOf(LCURL)+1,str.lastIndexOf(RCURL));
}
munge.addSelector = function(str,obj) {
	return obj[str.substring(0,str.indexOf(LCURL))] = str.substring(str.indexOf(LCURL)+1,str.length-1);
}
munge.extractMedias = function(css) {
	var all=css=clean(css),medias = [],mat,ind,strt,end,blk;
	all = css.replace(/(\@media.+?\}\})/g,function(m) { medias.push(m);return ''});
	medias.push('@media all{'+all+'}');
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
var dev2 = false;
function tokenize(css, context, tokens) {
    var munged = (typeof css == 'string' ? munge(css) : css);
    for(var media in munged){
        var sheet = {};
        munged[media].forEach(function(m,i,a) {
            var decl ={};
            for(var selector in m){
                decl[selector] = new Declaration(selector, parseProperties(m[selector]));
            }
            munged[media] = decl;
        });
    }
    return munged;
};
tokenize.RE = [(/\@media\s+?(\w+)?/)];
/*
    Stringifies tokenized data.
*/
function stringify(tokenized) {
    
    var css = [],vals;
     for (var media in tokenized) {
         css.push('@media ' + media + LCURL)
         for(var k in tokenized[media]){
             dec = tokenized[media][k];
             css.push(TAB + dec.selector + LCURL);
             dec.properties.forEach(function(prop) {
                 var vals = prop.groups.join(COMMA);
                 css.push([TAB,SPC,prop.name,COLON,vals,SEMI].join(EMPTY));
             });
             css.push(TAB+RCURL);             
         }
         // .forEach(function(dec) {
         // });
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
})(this);
