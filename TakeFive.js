// http://www.codewars.com/kata/largest-5-digit-number-in-a-series


var takeFive = function (str) {
  var x = str.split('').map(Number);
  if (str.length < 5) return Number(str);
  var getFive = function (i) { return 10000*x[i]+1000*x[i+1]+100*x[i+2]+10*x[i+3]+x[i+4]; };
  return x.reduce(function(p,c,idx,arr) { if (idx > arr.length-5) return p; c = getFive(idx); return (p<c)?c:p; },getFive(0));
};

module ("TakeFive")

  test("takeFive('123456549078') => 65490", function () {
    equal(takeFive('123456549078'), 65490, "takeFive('123456549078') => 65490")
  });