String.prototype.toJadenCase = function () {
  return this.replace(/(^|\s)[a-z]/g, function(x){ return x.toUpperCase(); });
};

function circleArea(radius) {
  var isNum = function (value) {return (value instanceof Number||typeof value === 'number') && !isNaN(value);}
  if (!isNum(radius)) return false;
  if (radius <= 0) return false;
  return (Math.PI*radius*radius).toFixed(2);
}

function solution(pairs){
    return Object.getOwnPropertyNames(pairs).map(function(x){return x+" = "+pairs[x];}).join(','); 
}
    
function getMissingElement(a){
    var x = [0,1,2,3,4,5,6,7,8,9];
    for (var i=0; i<a.length;i++)
        x[a[i]]=-1;
    return x.filter(function(y){return y!=-1;})[0];
}

module("getMissingElement")
    test("[0,5,1,3,2,9,7,6,4]", function () {
        equal(getMissingElement([0,5,1,3,2,9,7,6,4]), 8, "passed");
    });
    
    test("[9,2,4,5,7,0,8,6,1]", function () {
        equal(getMissingElement([9,2,4,5,7,0,8,6,1]), 3, "passed");
    });
    
    module("pairs")
    test("{a: 1, b: '2'}", function () {
        equal(solution({a: 1, b: '2'}), "a = 1,b = 2", "passed");
    });
    
    module("cicle area")
    test("negative", function () {
        equal(circleArea(-1485.86), false, "passed");
    });
    
    test("zero", function () {
        equal(circleArea(0), false, "passed");
    });
    
    test("float", function () {
        equal(circleArea(43.2673), 5881.25, "passed");
    });
    
    test("int", function () {
        equal(circleArea(68), 14526.72, "passed");
    });
    
    test("string", function () {
        equal(circleArea("number"), false, "passed");
    });
    
    // dummies
    
    module("dummy 1")
    test("dummy", function () {
        ok(true, "dummy 1 passed");
    });
    
    module("dummy 2")
    test("dummy 2", function () {
        equal(1, 1, "dummy passed");
    });

    module("dummy 3")
    test("dummy 3", function () {
        deepEqual([1, 1], [1,1], "dummy passed");
    });