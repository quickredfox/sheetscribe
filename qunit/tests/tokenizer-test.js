// detect native method in object
// not same scope of isHostObject
var isNative = function(method) {
  return (/.*/).test(method);
}

module("Test Helpers");
test('isNative',function() {
    ok(isNative(String.toString), 'should be true.');
    ok(isNative(isNative), 'should be false.');    
});

module("Extendend natives");
test('Array.prototype.forEach',function() {
    if(!isNative(Array.prototype.forEach)){
        var arr = [1,2,3],res=[];        
        arr.forEach(function(v) {
            res.push(v);
        })
        same(res,[1,2,3],'forEach implementation is good enough.');
    }else{
        ok(true,'forEach is native, perfect!')
    }
});

test('String.prototype.numOccurences',function() {
    var stringToTest = "AMC!@#$!@#A!@MDKBFDX$@%^AQK!@#$N@#K$JA!@#L$K!@L#$JKA!@#$KJ!@#$K!J@#$A";
    ok(stringToTest.numOccurences('A') == 6,'should count occurences of argument in string with one character');
    ok(stringToTest.numOccurences('MDKBFDX') == 1,'should count occurences of argument in string with multiple character');   
});

test('String.prototype.trim',function() {
    if(!isNative(String.prototype.trim)){
        var str = " test     ";
        same(str.trim(),'test','Should trim whitespace from both ends')
    }else{
        ok(true,'trim is native, perfect!')
    }
});

module("Data Objects");
var prop,dec,sheet;
test('PropertyObject',function() {
    var name = 'color';
    prop = new Property(name,['red','blue']);    
    same(prop.toString(),name,'toString() should be the name')   
    same(prop.toCSS(),'color:red,blue;','toCSS() should generate proper rules')  
});
test('DeclarationObject',function() {
    var sel = '#testselector';
        dec = new Declaration(sel,[prop]);
    same(dec.toString(),sel,'toString() should be the selector')
    same(dec.toCSS(),'#testselector{color:red,blue;}','toCSS() should generate proper rules')      
});
test('SheetObject',function() {
    var media = 'all';
        sheet = new Sheet(media,[dec]);
    same(sheet.toString(),media,'toString() should be the media')
    same(sheet.toCSS(),'@media all{#testselector{color:red,blue;}}','toCSS() should generate proper rules')      
});


module("Tokenizer")
test('integral()',function() {
    var testStringA = '{{{{{}}}}}';
    var testStringB = '{{{{{}}}}}}';    
    var testStringC = "border-radius:3px;-moz-border-radius;{-webkit-border:0;";
    var testStringD = ';border-radius:3px;filter:Microsfot:qwerqwer';    
    ok(integral(testStringA),"should be integral when all open and close curly count is equal");
    ok(!integral(testStringB),"should NOT be integral when all open and close curlies count dont match");    
    ok(!integral(testStringC),"should NOT be integral when comprising vendor hacks");        
    ok(!integral(testStringD),"should NOT be integral when comprising filter declarations");            
});
test('clean()',function() {
    var got = clean("\
        body{\
            background:#00f;\
            color:red\
        }\
        /*\
            bleeh bleh bleh \
        */\
        .a,.b,#c,dd,p.e:first{\
            padding:3px;\
            border:1px solid red;\
        }\
    ");
    var exp = 'body{background:#00f;color:red;}.a,.b,#c,dd,p.e:first{padding:3px;border:1px solid red;}'
    equals(got,exp,"should clean out comments and such (suck-ass test really)");
})
test('munge()',function() {
    var got = munge("\
    @media dev, dev2 {\
     #shouldbedev { trueness: true; }\
     #shouldbedev2 { trueness: true;}\
    }\
    body{\
        mediaall: true;\
    }\
    body p {\
        foo:bar;\
    }\
    @media screen {\
        #shouldbescreen { trueness: true;} \
    }\
    h1{\
        color:red;\
    }\
    ")
    var expected = {
        dev: [
           {"#shouldbedev":'trueness:true;',"#shouldbedev2":'trueness:true;'}
        ],
        dev2: [
         {"#shouldbedev":'trueness:true;',"#shouldbedev2":'trueness:true;'}
        ],
        screen: [
         {"#shouldbescreen":'trueness:true;'},
        ],
        all: [
          {'body':'mediaall:true;','body p':'foo:bar;','h1':'color:red;'}                    
        ]
    }
    ok(got.all,'Should have an "all" @media block')
    ok(got.dev,'Should have a "dev" @media block')    
    ok(got.dev2,'Should have a "dev" @media block')        
    ok(got.screen,'Should have a "screen" @media block')            
    same(got,expected,"Should munge as expected")
})


test('tokenize()/stringify()',function() {
    var tokens = tokenize("\
    @media dev, dev2 {\
     #shouldbedev { trueness: true; }\
     #shouldbedev2 { trueness: true;}\
    }\
    body{\
        mediaall: true;\
    }\
    body p {\
        foo:bar;\
    }\
    @media screen {\
        #shouldbescreen { trueness: true;} \
    }\
    h1{\
        color:red;\
    }\
    ");
    var string = stringify(tokens);
    var expected = "@media {#shouldbedev{trueness:true;}#shouldbedev2{trueness:true;}}@media {#shouldbedev{trueness:true;}#shouldbedev2{trueness:true;}}@media {#shouldbescreen{trueness:true;}}@media {body{mediaall:true;}body p{foo:bar;}h1{color:red;}}"
    equals(string,expected,"Should tokenize and the stringify")
})

test('parse.assign()',function() {
    var css = "\
    @media dev, dev2 {\
     #shouldbedev { trueness: true; }\
     #shouldbedev2 { trueness: true;}\
    }\
    body{\
        mediaall: true;\
    }\
    body p {\
        foo:bar;\
    }\
    @media screen {\
        #shouldbescreen { trueness: true;} \
    }\
    h1{\
        color:red;\
    }\
    ";
    var tokens = tokenize(css);
    var form1 = parse.assign([css,'dev',proc]);
    var form2 = parse.assign([css,proc]);    
    var form3 = parse.assign([css,'dev']);    
    var form4 = parse.assign([css]);        
    
    same( form1.tokens ,tokens,'Should put tokens in 1st place with arglength of 3')
    same( form1.media ,'dev','Should put "media" in 2nd place with arglength of 3')    
    same( form1.processors ,proc,'Should put "processors" in 3rd place with arglength of 3')     
    
    same( form2.media ,'all','Should assign media "all" when processors are 2nd argument')    
    same( form2.processors ,proc,'Should shift arg pos of "processors" when assigning media "all" when processors are 2nd argument')        
    
    same( form3.processors ,{},'Should assign processors to "{}" when media is 2nd argument')    
    same( form3.media ,'dev','Should still have everything in order...')        
    
    same( form4.tokens, tokens, "Should always parse tokens...")
    same( form4.media, 'all', "Should always have a media...")
    same( form4.processors, {}, "Should always have a processors object...")    
})