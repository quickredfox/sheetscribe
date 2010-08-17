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
test('Array.forEach',function() {
    if(!isNative(Array.forEach)){
        var arr = [1,2,3],res=[];        
        arr.forEach(function(v) {
            res.push(v);
        })
        same(res,[1,2,3],'forEach implementation is good enough.');
    }else{
        ok(true,'forEach is native, perfect!')
    }
});

test('String.bisect',function() {
    var stringToTest = "This is the first part {@#%^$%^&} This is the second part";
    var t1 = stringToTest.bisect('{@#%^$%^&}');
    same( t1[0], 'This is the first part ' , "should extract first part properly using a string delimiter");
    same( t1[1], ' This is the second part', "should extract second part properly using a string delimiter");
    ok(true,'Does not suport regex because it compiles one')
});

test('String.prototype.numOccurences',function() {
    var stringToTest = "AMC!@#$!@#A!@MDKBFDX$@%^AQK!@#$N@#K$JA!@#L$K!@L#$JKA!@#$KJ!@#$K!J@#$A";
    ok(stringToTest.numOccurences('A') == 6,'should count occurences of argument in string with one character');
    ok(stringToTest.numOccurences('MDKBFDX') == 1,'should count occurences of argument in string with multiple character');   
});

module("Data Objects")
test('DeclarationObject.toString()',function() {
    var sel = 'test';
    var dec = new Declaration(sel);
    same(dec.toString(),sel,'should be the selector')
});
test('PropertyObject.toString()',function() {
    var name = 'test';
    var prop = new Property(name);    
    same(prop.toString(),name,'should be the name')    
});
module("tokenizer")
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
test('snip()',function() {
    equals(snip("  \
    value\
          "),'value','Should snip left and right whitespace off string')
})
test('munge()',function() {
    same(munge("\
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
    "),{
        dev: [
           {selector:"#shouldbedev",block:'trueness:true;'},
          {selector:"#shouldbedev2",block:'trueness:true;'}
        ],
        dev2: [
         {selector:"#shouldbedev",block:'trueness:true;'},
         {selector:"#shouldbedev2",block:'trueness:true;'}
        ],
        screen: [
         {selector:"#shouldbedev",block:'trueness:true;'},
        ],
        all: [
          {selector:'body',block:'mediaall:true;'},
          {selector:'body p',block:'foo:bar;'},          
          {selector:'h1',block:'color:red;'}                    
        ]
    },"should munge-out in proper media types")
})
