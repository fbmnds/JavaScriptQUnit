// Description:

// Write a function that counts how many different ways you can make change for an amount of money, given an array of coin denominations. For example, there are 3 ways to give change for 4 if you have coins with denomination 1 and 2:

var countChange1 = function (amount_,coins_) {
  var rec2 = function(x,amount,coins,acc) {
    var res = acc;
    if (amount%x==0) res++;
    res += rec(amount,coins,0);
    for (i = 1; i < (amount/x)+1; i++) 
      res += rec(amount-i*x,coins,0);
    return res;
  };
  var rec = function (amount,coins,acc) {
    if (amount<1 || coins == []) return acc;
    if (coins.length == 1) return (amount%coins[0]==0)?acc+1:acc;
    var x = coins[coins.length-1]; 
    if (x > amount) return rec(amount, coins.slice(0,coins.length-1),acc);
    if (x == amount) return rec(amount, coins.slice(0,coins.length-1),acc+1);
    return rec2(x,amount,coins.slice(0,coins.length-1),acc);
  };
  return rec(amount_,coins_.sort(function(a, b){ return a - b; }),0);
};


var countChange2 = function (amount_,coins_) {
  var rec = function (amount,coins,acc) {
    if (amount<1 || coins == []) return acc;
    if (coins.length == 1) return (amount%coins[0]==0)?acc+1:acc;
    if (_amount%2==0) return (_amount/2,idx);
    var x = coins[coins.length-1]; 
    if (x > amount) return rec(amount, coins.slice(0,coins.length-1),acc);
    if (x == amount) return rec(amount, coins.slice(0,coins.length-1),acc+1);
    
    var res = acc;
    if (amount%x==0) res++;
    res += rec(amount,coins.slice(0,coins.length-1),0);
    for (i = 1; i < (amount/x)+1; i++) 
      res += rec(amount-i*x,coins.slice(0,coins.length-1),0);
    return res;
  };
  return rec(amount_,coins_.sort(function(a, b){ return a - b; }),0);
};

// http://www.integralist.co.uk/posts/understanding-recursion-in-functional-javascript-programming/

var tco = function (f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);

        if (!active) {
            active = true;

            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }

            active = false;

            return value;
        }
    }
}

var countChange3 = tco(function (amount_,coins_) {
  var rec = function (amount,coins,acc) {
    if (amount<1 || coins == []) return acc;
    if (coins.length == 1) return (amount%coins[0]==0)?acc+1:acc;
    var x = coins[coins.length-1]; 
    if (x > amount) return rec(amount, coins.slice(0,coins.length-1),acc);
    if (x == amount) return rec(amount, coins.slice(0,coins.length-1),acc+1);
    
    var res = acc;
    if (amount%x==0) res++;
    res += rec(amount,coins.slice(0,coins.length-1),0);
    for (i = 1; i < (amount/x)+1; i++) 
      res += rec(amount-i*x,coins.slice(0,coins.length-1),0);
    return res;
  };
  return rec(amount_,coins_.sort(function(a, b){ return a - b; }),0);
});


// http://www.sitepoint.com/implementing-memoization-in-javascript/

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

var countChange4 = memoize(function (amount,coins) {
  coins.sort(function(a, b){ return a - b; });
  
  var rec = function (_amount,idx) {
    if (_amount<1 || idx < 0) return 0;
    if (_amount==1) return coins[0]==1?1:0; 
    if (idx == 0) return (_amount%coins[0]==0)?1:0;
 
    var x = coins[idx]; 
    if (x > _amount) return rec(_amount, idx-1);
    if (x == _amount) return 1 + rec(_amount, idx-1);
    
    var res = 0;
    if (_amount%x==0) res++;
    res += rec(_amount,idx-1);
    if (_amount%2==0 && _amount > 2*x) _amount /=2;
    for (i = 1; i < _amount/x; i++) 
      res += rec(_amount-i*x,idx-1);
    return res;
  };
  return rec(amount,coins.length-1);
});

var countChange = function (amount,coins) {
  coins.sort(function(a, b){ return a - b; });
  
  var rec = function (_amount,idx) {
    if (_amount<1 || idx < 0) return 0;
    if (_amount==1) return coins[0]==1?1:0; 
    if (idx == 0) return (_amount%coins[0]==0)?1:0;
 
    var x = coins[idx]; 
    if (x > _amount) return rec(_amount, idx-1);
    if (x == _amount) return 1 + rec(_amount, idx-1);
    
    var res = 0;
    if (_amount%x==0) res++;
    res += rec(_amount,idx-1);
    for (var i = 1; i < _amount/x+1; i++) 
      res += rec(_amount-i*x,idx-1);
    return res;
  };
  if (amount == 0) return 1;
  return rec(amount,coins.length-1);
};

module("CountingChangeCombinations")
    
  test("countChange(10, [2,3,5]) // => 4", function () {
      equal(countChange(10, [2,3,5]), 4, "countChange(10, [2,3,5]) // => 4");
  });
  
  test("[5,2,3].sort() // => [2,3,5]", function () {
      deepEqual([5,2,3].sort(), [2,3,5], "[5,2,3].sort() // => [2,3,5]");
  });
  
  test("[5,2,3].pop() // => 3", function () {
      equal([5,2,3].pop(), 3, "[5,2,3].pop() // => 3");
  });
  
  test("countChange(4, [1,2]) // => 3", function () {
      equal(countChange(4, [1,2]), 3, "countChange(4, [1,2]) // => 3");
  });
  
  test("countChange(10, [2]) // => 1", function () {
      equal(countChange(10, [2]), 1, "countChange(10, [2]) // => 1");
  });
  
    test("countChange(2, [2]) // => 1", function () {
      equal(countChange(2, [2]), 1, "countChange(2, [2]) // => 1");
  });
  
  test("countChange(5, [2,3]) // => 1", function () {
      equal(countChange(5, [2,3]), 1, "countChange(5, [2,3]) // => 1");
  });
  
  test("countChange(10, [2,3]) // => 2", function () {
      equal(countChange(10, [2,3]), 2, "countChange(10, [2,3]) // => 2");
  });
  
  test("countChange(10, [5,2,3]) // => 4", function () {
      equal(countChange(10, [5,2,3]), 4, "countChange(10, [5,2,3]) // => 4");
  });
  
  test("countChange(11, [5,7]) //  => 0", function () {
      equal(countChange(11, [5,7]), 0, "countChange(11, [5,7]) //  => 0");
  }); 
  
  test("countChange(1024, [2]) //  => 1", function () {
      equal(countChange(1024, [2]), 1, "countChange(1024, [2]) //  => 1");
  }); 
