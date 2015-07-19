var flip = function (fn) {
  return function f() {
    var args = Array.prototype.slice.call(f.arguments);
    return fn.apply(null,args.reverse());
  };
};

function print(a,b) {
   return a + " -> " + b;
};

 
module("CombinatorFlip")
 
  test("flip(print)(4,5) // returns '5 -> 4'", function () {
      equal(flip(print)(4,5), '5 -> 4', "flip(print)(4,5) // returns '5 -> 4'");
  });
    
    