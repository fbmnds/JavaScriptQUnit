/*
Your objective is to add formatting to a plain number to display it as price.

The function should return a string like this:

var price = numberToPrice(13253.5123);
console.log(price); // 13,253.51

Numbers should use the standard comma for every 3 numbers and dot to separate the cents, cents need to be truncated to 2 decimals, 
in the case that the decimal part of the number is 1 character long or none you should add 0's so that the result will always have 2 decimal characters,
 the function will also evaluate negative numbers.

function should return a string 'NaN' if the input is not a valid number

Test.assertEquals(numberToPrice(1500.129),   '1,500.12');
Test.assertEquals(numberToPrice(-5),         '-5.00');
Test.assertEquals(numberToPrice(1000000.5),  '1,000,000.50');
Test.assertEquals(numberToPrice('@'),        'NaN');
*/


/*
var getCommas = function (n) {
  if (n < 1000) return n.toString();
  return getCommas(n/1000)+','+(n%1000).toString();
};

var numberToPrice = function (x) {
  if (!isNum(x)) return 'NaN';
  if (x < 0) return '-'+numberToPrice(-1*x);
  if (isInt(x)) return getCommas(x)+".00";
  var y = x.toString().split('.');
  var digits;
  if (y[1].length == 0) digits = '00';
  if (y[1].length == 1) digits = y[1] + '0';
  if (y[1].length > 1) digits = y[i].substr(0,2);
  
  var z = (y*100.0).toFixed();
  return getCommas(y)+(digits<10?'0'+digits.toString():digits.toString());
};
*/

var isNum = function (value) {return (value instanceof Number||typeof value === 'number') && !isNaN(value);};
var isInt = function (n){ return isNum(n) && isFinite(n) && n%1===0;};

var getCommas = function (n) {
  if (n.length < 4) return n;
  return getCommas(n.substr(0,n.length-3))+','+n.substr(-3);
};

var numberToPrice = function (x) {
  if (!isNum(x)) return 'NaN';
  if (x < 0) return '-'+numberToPrice(-1*x);
  var z = x.toLocaleString("en-US", {useGrouping:false, minimumfractiondigits:3}).split('.');
  //alert(z[0]+'/'+z[1]);
  if (z.length < 1) return 'NaN';
  var zz = getCommas(z[0]);
  if (z.length == 1) return zz+'.00';
  return z[1].length==1?zz+'.'+z[1]+'0':zz+'.'+z[1].substr(0,2);
};

var numberToPrice_ = function(n) {
   return typeof n != 'number' ? 'NaN' : n.toFixed(3).replace(/\d$/, '').replace(/(\d)(?=(?:\d{3})+\.)/g, '$1,')
}

module ("NumberToPrice")

  test ("numberToPrice(1500.129),   '1,500.12'", function () {
    equal(numberToPrice(1500.129), '1,500.12', "numberToPrice(1500.129),   '1,500.12'")
  });
  
  test ("numberToPrice(-5),         '-5.00'", function () {
    equal(numberToPrice(-5), '-5.00', "numberToPrice(-5),         '-5.00'")
  });
  
  test ("numberToPrice(1000000.5),  '1,000,000.50'", function () {
    equal(numberToPrice(1000000.5), '1,000,000.50', "numberToPrice(1000000.5),  '1,000,000.50'")
  });
  
  test ("numberToPrice('@'),   'NaN'", function () {
    equal(numberToPrice('@'), 'NaN', "numberToPrice('@'),   'NaN'")
  });

  test ("numberToPrice(245123215.0),  '245,123,215.00'", function () {
    equal(numberToPrice(245123215.0), '245,123,215.00', "numberToPrice(245123215.0),  '245,123,215.00'")
  });