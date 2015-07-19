// In this kata, you must create a digital_root function.

// A digital root is the recursive sum of all the digits in a number. Given n, take the sum of the digits of n. 
// If that value has two digits, continue reducing in this way until a single-digit number is produced. 
// This is only applicable to the natural numbers.

var digital_sum = function(n) {
  if (n < 10) return n;
  var r = n%10;
  var x = r;
  var z = Math.floor(n/10);
  while (z > 0) {
    r = z%10;
    x += r;
    z = Math.floor(z/10);
  };
  return x;
};

var digital_root = function(n) {
  var x = digital_sum(n);
  if (x < 10) return x;
  return digital_root(x);
};


module("DigitalRoot")
    
  test("digital_sum(16) => 7", function () {
      equal(digital_sum(16), 7, "digital_sum(16) => 7");
  });
  
  test("digital_sum(942) => 15", function () {
      equal(digital_sum(942), 15, "digital_sum(942) => 15");
  });

  test("digital_sum(1942) => 16", function () {
      equal(digital_sum(1942), 16, "digital_sum(1942) => 16");
  });  
    
  test("digital_root(16) => 7", function () {
      equal(digital_root(16), 7, "digital_root(16) => 7");
  });
  
  test("digital_root(942) => 6", function () {
      equal(digital_root(942), 6, "digital_root(942) => 6");
  });

  test("digital_root(1942) => 7", function () {
      equal(digital_root(1942), 7, "digital_root(1942) => 7");
  });