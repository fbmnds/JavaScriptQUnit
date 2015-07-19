// The Ackermann function is a famous function that played a big role in computability theory as the first exemple of a total computable function that is not primitive recursive.

// Since then the function has been a bit simplified but is still of good use. Due to its definition in terms of extremely deep recursion it can be used as a benchmark of a compiler's ability to optimize recursion.

// The goal of this kata is to code a function wich will be given two input, m and n, and will return the Ackermann number A(m,n) defined by:

// A(m,n) = n+1                          if m=0  
// A(m,n) = A(m-1,1)                     if m>0 , n=0
// A(m,n) = A(m-1,A(m,n-1))              if m,n > 0

// m,n should be non-negative integer, the function should return null (Javascript), None (Python) for other type, for non-integer and negative numbers.



var isNum = function (value) {return (value instanceof Number||typeof value === 'number') && !isNaN(value);};
var isInt = function (n){ return isNum(n) && isFinite(n) && n%1===0;};

var A = function(m,n) {
  if (isInt(m) && m > -1 && isInt(n) && n > -1) {
    if (m == 0) return n+1;
    if (n == 0) return A(m-1,1);
    return A(m-1,A(m,n-1));
  }
  else
    return null;
};

module("Ackermann")

  test("A(0,5) // return 6", function () {
    equal(A(0,5), 6, "A(0,5) // return 6");
  });