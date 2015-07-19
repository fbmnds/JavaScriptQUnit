/* 
Description:

Write a function that takes an array of values and moves all elements that are zero to the end of the array, otherwise preserving the order of the array. The zero elements must also maintain the order in which they occurred.

For example, the following array

[7, 2, 3, 0, 4, 6, 0, 0, 13, 0, 78, 0, 0, 19, 14]

is transformed into

[7, 2, 3, 4, 6, 13, 78, 19, 14, 0, 0, 0, 0, 0, 0]

Zero elements are defined by either 0 or "0". Some tests may include elements that are not number literals.

You are NOT allowed to use any temporary arrays or objects. You are also not allowed to use any Array.prototype or Object.prototype methods.
 */


var moveZeros = function (arr) {
  if (arr.length<2) return arr;
  var isTailZero = function (i) { for (var j = i; j < arr.length; j++) { if (arr[j]!==0&&arr[j]!=='0') return false; }; return true; };
  var isSwap = function(i) { return isTailZero(i)?false:(arr[i]===0||arr[i]==='0')&&(arr[i+1]!==0&&arr[i+1]!=='0'); };
  var doSwap = function(i) { var t = arr[i+1]; arr[i+1] = arr[i]; arr[i] = t; };
  var swapped;
  do {
    swapped = false;
    for (var i = 0; i < arr.length-1; i++) {
      if (isSwap(i)) { 
        doSwap(i); 
        swapped = true;
      };
    };
  } while (swapped);
  return arr;
};


var isTailZero_ = function (arr,i) { for (var j = i; j < arr.length; j++) { if (arr[j]!==0&&arr[j]!=='0') return false; }; return true; };
var isSwap_ = function(arr,i) { return isTailZero_(arr,i)?false:(arr[i]===0||arr[i]==='0')&&(arr[i+1]!==0&&arr[i+1]!=='0'); };
var doSwap_ = function(arr,i) { var t = arr[i+1]; arr[i+1] = arr[i]; arr[i] = t; };

var arr1 = [7, 2, 3, 0, 4, 6, 0, 0, 13, '0', 78, 0, 0, 19, 14];
var arr2 = [7, 2, 3, 4, 6, 13, 78, 19, 14, 0, 0, 0, '0', 0, 0];

module("MoveZeros")
  
  test("isSwap_(arr1,2) => false", function () {
    equal(isSwap_(arr1, 2), false, "isSwap_(arr1, 2) => false");
  });
  
  test("isSwap_(arr1,3) => true", function () {
    equal(isSwap_(arr1, 3), true, "isSwap_(arr1, 3) => true");
  });
  
  test("isSwap_(arr2, 8) => false", function () {
    equal(isSwap_(arr2, 8), false, "isSwap_(arr2, 8) => false");
  });
  
  test("isTailZero_(arr1,3) => false", function () {
    equal(isTailZero_(arr1, 3), false, "isTailZero_(arr1, 3) => false");
  });
  
  test("isTailZero_(arr1,2) => false", function () {
    equal(isTailZero_(arr1, 2), false, "isTailZero_(arr1, 2) => false");
  });
  
  test("isTailZero_(arr1, 14) => false", function () {
    equal(isTailZero_(arr1, 14), false, "isTailZero_(arr1, 14) => false");
  });
  
  test("isTailZero_(arr2,8) => false", function () {
    equal(isTailZero_(arr2, 8), false, "isTailZero_(arr2, 8) => false");
  });
  
  test("isTailZero_(arr2, 9) => true", function () {
    equal(isTailZero_(arr2, 9), true, "isTailZero_(arr2, 9) => true");
  });
  
  test("isTailZero_(arr2, 13) => true", function () {
    equal(isTailZero_(arr2, 13), true, "isTailZero_(arr2, 13) => true");
  });
  
  test("isTailZero_(arr2, 14) => true", function () {
    equal(isTailZero_(arr2, 14), true, "isTailZero_(arr2, 14) => true");
  });
  
  
  test("[7, 2, 3, 0, 4, 6, 0, 0, 13, 0, 78, 0, 0, 19, 14] => [7, 2, 3, 4, 6, 13, 78, 19, 14, 0, 0, 0, 0, 0, 0]", function () {
    deepEqual(moveZeros(arr1), arr2, "[7, 2, 3, 0, 4, 6, 0, 0, 13, 0, 78, 0, 0, 19, 14] => [7, 2, 3, 4, 6, 13, 78, 19, 14, 0, 0, 0, 0, 0, 0]");
  });
  