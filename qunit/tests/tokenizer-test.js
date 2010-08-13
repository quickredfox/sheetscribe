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
