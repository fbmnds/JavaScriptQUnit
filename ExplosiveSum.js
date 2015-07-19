
var g = function(k) { return (k*(3*k-1))>>1; };
 
var sign = function(k) { return k%2==0?-1:1; }; 
  
function memoize(func) {
  var memo = {};
  var slice = Array.prototype.slice;

  return function() {
    var args = slice.call(arguments);

    if (args in memo)
      return memo[args];
    else
      return (memo[args] = func.apply(this, args));

  }
}

var sum1 = memoize(function(n) {
  if (n < 0) return 0;
  if (n < 2) return 1;
  var p = 0;
  var k = 1;
  while (n >= g(k)) {
    p += sign(k)*sum1(n-g(k));
    if (n >= g(-1*k)) p += sign(-1*k)*sum1(n-g(-1*k));
    k++;
  };
  return p;
});

var sum = function (n) {
  return n==0?0:sum1(n);
}; 

module("ExplosiveSum")
  
  test("g(1) // => 1", function () {
    equal (g(1), 1, "g(1) // => 1");
  });
  
  test("g(-1) // => 2", function () {
    equal (g(-1), 2, "g(-1) // => 2");
  });
  
  test("g(2) // => 5", function () {
    equal (g(2), 5, "g(2) // => 5");
  });
  
  test("g(-2) // => 7", function () {
    equal (g(-2), 7, "g(-2) // => 7");
  });
  
  test("sum(2) // => 2", function () {
    equal (sum(2), 2, "sum(2) // => 2");
  });
  
  test("sum(3) // => 3", function () {
    equal (sum(3), 3, "sum(3) // => 3");
  });
  
  test("sum(4) // => 5", function () {
    equal (sum(4), 5, "sum(4) // => 5");
  });
  
  test("sum(5) // => 7", function () {
    equal (sum(5), 7, "sum(5) // => 7");
  });

  test("sum(10) // => 42", function () {
    equal (sum(10), 42, "sum(10) // => 42");
  });

  test("sum(50) // => 204226", function () {
    equal (sum(50), 204226, "sum(50) // => 204226");
  });

  test("sum(80) // => 15796476", function () {
    equal (sum(80), 15796476, "sum(80) // => 15796476");
  });
  
  test("sum(100) // => 190569292", function () {
    equal (sum(100), 190569292, "sum(100) // => 190569292");
  });   

