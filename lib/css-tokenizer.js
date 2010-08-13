/////////////// DO NOT EDIT, FILE IS GENERATED ///////////////
(function(window,undefined){
/*
    A tiny tiny bit faster.
*/
var FMATCH="$1",LCURL = '{',RCURL='}',DRCURL='}}',EMPTY='',COLON=':',SEMI=';',SPC=' ',COMMA=',';
/*
    Sake of convenience...
*/
var log = function(){
  if(window.console) return window.console.log.apply(null,arguments);
  var __noop = function(){};
  window.console={
      info: __noop,
      log:__noop,
      debug: __noop
  };
  return arguments;
}
/*
    Add forEach if not present in Array implementation.
*/
if (!Array.prototype.forEach){
  Array.prototype.forEach = function(fun /*, thisp*/){
    var len = this.length >>> 0;
    if (typeof fun != "function") throw new TypeError();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++){
      if (i in this) fun.call(thisp, this[i], i, this);
    }
  };
}
/*
      Splits a string 3-ways along delimiter.
      Delimiter can be a regex or a string.
      Returns an array with [before,delimiter,after]
*/
String.prototype.bisect = function( delimiter){
  var i,m,l=1;
  if(typeof delimiter == 'string') i = this.indexOf(delimiter);
  if(delimiter.exec){
     m = this.match(delimiter);
     i = m.index;
     l = m[0].length
  }
  if(!i) i = this.length/2;
  var res=[],temp;
  if(temp = this.substring(0,i)) res.push(temp);
  if(temp = this.substr(i,l)) res.push(temp);
  if(temp = this.substring(i+l)) res.push(temp);
  if(res.length == 3) return res;
  return null;
};
/*
    Counts the number of times "chr" appears in this string.
*/
String.prototype.numOccurences = function(chr) {
    return --this.split(chr).length;
}
/*
    Data Objects.
*/
var Declaration = function(selector,properties) {
    this.selector = selector;
    this.properties = properties;
    this.toString = function() {
        return this.selector;
    };
};
var Property = function(name,groups) {
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
    return css.numOccurences(LCURL) === css.numOccurences(RCURL) && !(integral.RE[0]).test(css);
}
integral.RE = [(/[\{\;]\s+?\-/g)];
/*
    Removes a bunch of stuff for ease of parsing, see clean.RE[].
    n.b.: Measured with jslitmus and this approach seems to be fastest.
*/
function clean(css) {
    clean.RE.forEach(function(re) {
        css = css.replace(re[0],re[1]);
    })
    return css;
};
clean.RE = [
 [(/\/\*[^*]*\*+([^\/*][^*]*\*+)*\//g),EMPTY], // strip out comments and extra linebreaks/whitespace.
 [(/([\r\n\t\s]){1,}/gm),FMATCH],              // strip out multiple whitespace.
 [(/[\n\t\s\r]+?([\{\}])[\n\t\s\r]+?/g),FMATCH], // strip out extra whitespace before and after curlies.
 [(/([^\}\;])\}/g),FMATCH+";}"]                // bring back optional last semicolon.
];
/* 
    Remove linebreaks/whitespace at begining and end of string. 
*/
function snip(str) {
    return str.replace(/^[\s]+|[\s]+$/g,EMPTY);
};
/* 
    Travels until "chr" within a string "str" and call "fn" with the "head" and "footer" data 
    (before and after chr) and then continues until it reaches end of string.
*/
function travel(chr,str,fn) {
    var parts = str.bisect(chr);
    fn(parts[0],parts[2]);
    if((/\{/).test(parts[2])){
        return travel(chr,parts[2],fn)
    }
};
/* 
    Munges the css into structured object.
    note the pun: Quite contrary to the meaning of "munge".
*/
function munge(css) {
    var selectors = [];
    if(!integral(css)) throw "CSS is not valid!";
    travel(LCURL,css,function (head,foot) {
        var selector = (munge.RE[0]).exec(head);
        selectors.push({
            selector: snip(selector[0]),
            block: ( munge.inMedia(foot) ? munge( munge.shift( foot, true ) ) : munge.shift( foot ).replace(munge.RE[1],EMPTY) )
        })
    });
    return selectors;
};
munge.RE = [(/[^\}\{]+$/),(/\}$/)];
/* 
    Detects if we're in a sub-block (@media declaration).
*/
munge.inMedia = function(css) {
    var i = [css.indexOf(LCURL),css.indexOf(RCURL)];
    return (i[0] > -1 && i[0]<i[1]);
};
/* 
    Moves to next chunk.
*/
munge.shift = function(css,sub) {
    return css.substring(0,css.indexOf((sub?DRCURL:RCURL))+1);
};
/*
    Parses a properties string into an object with a value groups array for each property name.
*/
function parseProperties(properties) {
    var props = [],name,colon;
    properties.split(SEMI).forEach(function(pair) {
        colon = pair.indexOf(COLON);
        if(name = pair.substring(0,colon)){                
            props.push(new Property(snip(name),snip(pair.substring(colon+1)).split(',')))
        }
    });
    return props;
}
/*
    Tokenize the properties and munged data.
*/
function tokenize(css,context,tokens) {
    var munged = (typeof css == 'string' ? munge(clean(css)) : css),
        tokenized = tokens||{};
        media = context || 'all';
        function translate (declaration) {
                if(!context && tokenize.RE[0].test(declaration.selector))
                return tokenize( declaration.block, snip(declaration.selector.match(tokenize.RE[0])[1]) ,tokenized);
                if(!tokenized[media]) tokenized[media] = [];
                return tokenized[media].push(new Declaration(declaration.selector,parseProperties(declaration.block)))
            }
    munged.forEach(translate);
    return tokenized;
};
tokenize.RE = [(/media\s+?(\w+)?/)];
/*
    Stringifies tokenized data.
*/
function stringify(tokenized,media) {
    var css = [];
    for(var media in tokenized){
        css.push('@media '+media+'{')
        tokenized[media].forEach(function(dec) {
            css.push("\t"+dec.selector+'{');
            dec.properties.forEach(function(prop) {
                css.push("\t"+SPC+prop.name+COLON+prop.groups.join(COMMA)+SEMI)
            });
            css.push("\t"+'}');
        });            
        css.push('}')
    }
    return css.join("\n");
};

/// temporary to be able to test in browser AND in node.
if(window.$){
    $(function() {
        $.get('test.css',function(css) {
                var css = clean(css);
                var tokenized = tokenize(css);
                console.debug(tokenized)
                var stringified = stringify(tokenized);
        });
    });
}else{
    var fs = require('fs');
    var sys = require('sys');        
    sys.puts(JSON.stringify(tokenize(fs.readFileSync('test.css','utf8'))));
};
})(this);
