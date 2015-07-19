// So, your mission is...
    // if no i is provided consider it should be 1 ( not zero ).
    // if i is greater than str length : returns the whole str.
    
// done:
// if i === 0 : returns an empty string;
// if i is a string ( yes it can ) : returns part of str at left(/right) of i.
// i may be a negative integer. In this case the function returns the whole string but i 
//   right(/left)-most chars (respectively in left$(/right$) function).

var left$ = function(str,i) {
  if (typeof i === 'undefined') return left$(str,1);
  if (typeof i === 'string') {
    var idx = str.indexOf(i);
    return idx==-1?'':str.substring(0,idx);
  }
  if (i<0) return str.length+i<1?'':str.substring(0,str.length+i);
  if (i === 0) return "";
  return str.substr(str,i);
};
   
var right$ = function(str,i) {
  if (typeof i === 'undefined') return right$(str,1);
  if (typeof i === 'string') {
    var x = left$(str.split('').reverse().join(''),i.split('').reverse().join(''));
    return x==''?'':x.split('').reverse().join('');
  }
  if (i<0) return str.length+i<1?'':str.substring(-1*i);
  if (i === 0) return "";
  return i>str.length?str:str.substr(str.length-i);
};
   
    
var str = 'Hello (not so) cruel World!';

module("LeftRight")
    
  test("left$(str,5)   // -> 'Hello'", function () {
      equal(left$(str,5), 'Hello', "passed");
  });
  
  test("left$(str,-22) // -> 'Hello'", function () {
      equal(left$(str,-22), 'Hello', "passed");
  });
  
  test("right$(str,-22) // -> 'orld!'", function () {
      equal(right$(str,-22), 'orld!', "passed");
  });
  
  test("left$(str,1)   // -> 'H'", function () {
      equal(left$(str,1), 'H', "passed");
  });
  
  test("left$(str)     // -> 'H' too", function () {
      equal(left$(str), 'H', "passed");
  });
  
  test("left$(str,0)   // -> ''", function () {
      equal(left$(str,0), '', "passed");
  });
  
  test("left$(str,99)  // -> 'Hello (not so) cruel World!'", function () {
      equal(left$(str,99), 'Hello (not so) cruel World!', "passed");
  });
  
  test("right$(str,6)  // -> 'World!'", function () {
      equal(right$(str,6), 'World!', "passed");
  });
  
  test("right$(str)    // -> '!'", function () {
      equal(right$(str), '!', "passed");
  });
  
  test("left$(str,'o') // -> 'Hell'", function () {
      equal(left$(str,'o'), 'Hell', "passed");
  });
  
  test("left$(str,'o ') // -> 'Hell'", function () {
      equal(left$(str,'o '), 'Hell', "passed");
  });
  
  test("right$(str,'o')// -> 'rld!'", function () {
      equal(right$(str,'o'), 'rld!', "passed");
  });
  
  test("right$(str,'Wo')// -> 'rld!'", function () {
      equal(right$(str,'Wo'), 'rld!', "passed");
  });
  
  test("left$(str,' ') // -> 'Hello'", function () {
      equal(left$(str,' '), 'Hello', "passed");
  });
  
  
  
  
  