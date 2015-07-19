// Description:

// In this Kata, you will implement [The Luhn Algorithm](http://en.wikipedia.org/wiki/Luhn_algorithm), 
// which is used to help validate credit card numbers.

// Given a positive integer of up to 16 digits, return true if it is a valid credit card number, 
// and false if it is not.

// Here is the algorithm:

    // If there are an even number of digits, double every other digit starting with the first, 
    // and if there are an odd number of digits, double every other digit starting with the second. 
    // Another way to think about it is, from the right to left, 
    // double every other digit starting with the second to last digit.

    // 1714 => [1*, 7, 1*, 4] => [2, 7, 2, 4]

    // 12345 => [1, 2*, 3, 4*, 5] => [1, 4, 3, 8, 5]

    // 891 => [8, 9*, 1] => [8, 18, 1]

    // If a resulting doubled number is greater than 9, replace it with either the sum of it's own digits, 
    // or 9 subtracted from it.

     // [8, 18*, 1] => [8, (1+8), 1] => [8, 9, 1]

     // (or)

     // [8, 18*, 1] => [8, (18-9), 1] => [8, 9, 1]

    // Sum all of the final digits

     // [8, 9, 1] => 8+9+1 => 18

    // Finally, take that sum and divide it by 10. 
    // If the remainder equals zero, the original credit card number is valid.

     // 18 (modulus) 10 => 8.  

     // 8 does not equal 0, so 891 is not a valid credit card number.
     
var digitize = function(n) {
  return n.toString().split('').map(function(x){return parseInt(x,10);});
};

var modify = function(n){ 
  var x = 2*n; 
  return x<10?x:x-9;
};

var validateCCN = function(n) {
  var x = digitize(n).reverse();
  for (var i = 1; i < x.length; i +=2)
    x[i] = modify(x[i]);
  return (x.reduce(function(a,b){return a+b;})%10==0);
};

module("ValidateCreditCardNumber")
    
  test("digitize(1601) => [1,6,0,1]", function () {
      deepEqual(digitize(1601), [1,6,0,1], "digitize(1601) => [1,6,0,1]");
  });
  
  test("validate(891) => false", function () {
      equal(validateCCN(891), false, "validate(891) => false");
  });
  
  test("validate(4829959778303139) => true", function () {
      equal(validateCCN(4829959778303139), true, "validate(4829959778303139) => true");
  });
  
  
  
// [
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4829959778303139
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4539311970726249
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4929866751762604
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4539621911621014
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4532616993364142
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4716002868348072
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4556244862223637
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4929324040723284
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4929459919071694
    // }
  // },
  // {
    // "CreditCard": {
      // "IssuingNetwork": "Visa",
      // "CardNumber": 4539040152665657
    // }
  // }
// ]