var trimLeftZeros = function (str) { 
  var x = str.replace(/^0+/g,'');
  return x==''?'0':x; 
};

var sumStrings = function (a,b) {
  var x = a.split('').map(Number).reverse();
  var y = b.split('').map(Number).reverse();
  var upper = x.length<y.length?y.length+1:x.length+1;
  for (var i = x.length; i < upper; i++)
    x.push(0);
  for (var i = y.length; i < upper; i++)
    y.push(0);  
  var z = [];
  var carry = 0;
  var t;
  for (var i = 0; i < upper; i++) {
    t = carry+x[i]+y[i];
    if (t > 9) {
      z.push(t-10);
      carry = 1;
    } else {
      z.push(t);
      carry = 0;
    };
  }; 
  return trimLeftZeros(z.reverse().join(''));
};

module ("StringBigInteger")
  
  test("trimLeftZeros('010'), '10'", function () {
    equal(trimLeftZeros('010'), '10', "trimLeftZeros('010'), '10'");
  });
  
  test("trimLeftZeros('00'), '0'", function () {
    equal(trimLeftZeros('00'), '0', "trimLeftZeros('00'), '0'");
  });
  
  test("trimLeftZeros('0'), '0'", function () {
    equal(trimLeftZeros('0'), '0', "trimLeftZeros('0'), '0'");
  });
  
  test("sumStrings('0', '0'), '0'", function () {
    equal(sumStrings('0', '0'), '0', "sumStrings('0', '0'), '0'");
  });
  test("sumStrings('1', '2'), '3'", function () {
    equal(sumStrings('1', '2'), '3', "sumStrings('1', '2'), '3'");
  });
  test("sumStrings('10', '1'), '11'", function () {
    equal(sumStrings('10', '1'), '11', "sumStrings('10', '1'), '11'");
  });
  test("sumStrings('1', '10'), '11'", function () {
    equal(sumStrings('1', '10'), '11', "sumStrings('1', '10'), '11'");
  });
  test("sumStrings('123', '456'), '579'", function () {
    equal(sumStrings('123', '456'), '579', "sumStrings('123', '456'), '579'");
  });
  test("sumStrings('999', '1'), '1000'", function () {
    equal(sumStrings('999', '1'), '1000', "sumStrings('999', '1'), '1000'");
  });
  test("sumStrings('999', '999'), '1998'", function () {
    equal(sumStrings('999', '999'), '1998', "sumStrings('999', '999'), '1998'");
  });
  test("sumStrings('712569312664357328695151392', '8100824045303269669937'), '712577413488402631964821329'", function () {
    equal(sumStrings('712569312664357328695151392', '8100824045303269669937'), '712577413488402631964821329', "sumStrings('712569312664357328695151392', '8100824045303269669937'), '712577413488402631964821329'");
  });
  test("sumStrings('01', '02'), '3'", function () {
    equal(sumStrings('01', '02'), '3', "sumStrings('01', '02'), '3'");
  });
  test("sumStrings('0001', '002'), '3'", function () {
    equal(sumStrings('0001', '002'), '3', "sumStrings('0001', '002'), '3'");
  });
  test("sumStrings('712569312664357328695151392712569312664357328695151392', '1'), '712569312664357328695151392712569312664357328695151393'", function () {
    equal(sumStrings('712569312664357328695151392712569312664357328695151392', '1'), '712569312664357328695151392712569312664357328695151393', "sumStrings('712569312664357328695151392712569312664357328695151392', '1'), '712569312664357328695151392712569312664357328695151393'");
  });
  test("sumStrings('10000000000000000', '1'), '10000000000000001'", function () {
    equal(sumStrings('10000000000000000', '1'), '10000000000000001', "sumStrings('10000000000000000', '1'), '10000000000000001'");
  });

/*
Test.assertEquals(sumStrings('0', '0'), '0');
Test.assertEquals(sumStrings('1', '2'), '3');
Test.assertEquals(sumStrings('10', '1'), '11');
Test.assertEquals(sumStrings('1', '10'), '11');
Test.assertEquals(sumStrings('123', '456'), '579');
Test.assertEquals(sumStrings('999', '1'), '1000');
Test.assertEquals(sumStrings('999', '999'), '1998');
Test.assertEquals(sumStrings('712569312664357328695151392', '8100824045303269669937'), '712577413488402631964821329');
Test.assertEquals(sumStrings('01', '02'), '3');
Test.assertEquals(sumStrings('0001', '002'), '3');
Test.assertEquals(sumStrings('712569312664357328695151392712569312664357328695151392', '1'), '712569312664357328695151392712569312664357328695151393');
Test.assertEquals(sumStrings('10000000000000000', '1'), '10000000000000001');
*/