var Counter = function () {
  this.counter = 0; 
};

Counter.prototype.valueOf = function(){ return this.counter; };

Counter.prototype.incr = function() { this.counter++; };

var c = new Counter();
c.incr(); 

module("NumberLikeCounter")

  test("c + 1; // 2", function () {
    equal(c + 1 == 2, true, "c + 1; // 2")
  });
  
  test("c > 1; // false", function () {
    equal(c > 1, false, "c > 1; // false");
  });
  
  test("c > 0; // true", function () {
    equal(c > 0, true, "c > 0; // true");
  });
  
  test("c == 1; // true", function () {
    equal(c == 1, true, "c == 1; // true");
  });
  
  test("Math.sqrt(c); // 1", function () {
    equal(Math.sqrt(c), 1, "Math.sqrt(c); // 1");
  });