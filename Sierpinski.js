var repeat = function(str,n) {
  return Array(n+1).join(str);
};

var sierpinski = function(n) {
  if (n==0) return 'L';
  if (n==1) return ['L','L L'].join('\n'); 
  var res = [];
  res.length = 2<<(n-1);
  res[0] = ['L'];
  res[1] = ['L L'];
  var base;
  var idx;
  var dist = ' ';
  var pad;
  for (var i = 1; i < n; i++) {
    base = Math.pow(2,i);
    dist = repeat(dist,2) + ' ';
    pad = dist+'  ';
    for (var j = base; j < 2*base; j++) {
      pad = pad.slice(0,-2);
      idx = j-base;
      res[j] = res[idx]+pad+res[idx];
    };
  };
  return res.join('\n');
};

 // 123456789012345
// '               '
 // 1234567
// '       '
 // 123
// '   '
// L
// L L
// L   L
// L L L L
// L       L
// L L     L L
// L   L   L   L
// L L L L L L L L
// L               L

var level0 = 'L';
var level1 = [
    'L',
    'L L'
].join('\n');
var level2 = [
    'L',
    'L L',
    'L   L',
    'L L L L'
].join('\n');
var level3 = [
    'L',
    'L L',
    'L   L',
    'L L L L',
    'L       L',
    'L L     L L',
    'L   L   L   L',
    'L L L L L L L L'
].join('\n');


module("Sierpinski")
  
  test("2<<0 // => 2", function () {
    equal(2<<0, 2, "2<<0 // => 2");
  });
  
  test("2<<1 // => 4", function () {
    equal(2<<1, 4, "2<<1 // => 4");
  });
  
  test("2<<9 // => 1024", function () {
    equal(2<<9, 1024, "2<<9 // => 1024");
  });
  
  test("repeat('L ',) // => 'L L L '", function () {
    equal(repeat('L ',3), 'L L L ', "repeat('L ',3) // => 'L L L '");
  });
  
  test("sierpinski(0) // => 'L'", function () {
    equal(sierpinski(0), level0, "sierpinski(0) // => 'L'");
  });

  test("sierpinski(1) // => \n"+level1, function () {
    equal(sierpinski(1), level1, "sierpinski(0) // => \n"+level1);
  });
  
  test("sierpinski(2) // => \n"+level2, function () {
    equal(sierpinski(2), level2, "sierpinski(0) // => \n"+level2);
  });
  
  test("sierpinski(3) // => \n"+level3, function () {
   equal(sierpinski(3), level3, "sierpinski(3) // => \n"+level3);
  });
  
  // Test.expect(sierpinski(0) == level0, "sierpinski(0) should equal\n<pre>" + level0 + "</pre>\n but was \n<pre>" + sierpinski(0) + "</pre>");

// Test.expect(sierpinski(1) == level1, "sierpinski(1) should equal\n<pre>" + level0 + "</pre>\n but was \n<pre>" + sierpinski(1) + "</pre>");

// Test.expect(sierpinski(2) == level2, "sierpinski(2) should equal\n<pre>" + level2 + "</pre>\n but was \n<pre>" + sierpinski(2) + "</pre>");
// Test.expect(sierpinski(3) == level3, "sierpinski(3) should equal\n<pre>" + level3 + "</pre>\n but was \n<pre>" + sierpinski(3) + "</pre>");