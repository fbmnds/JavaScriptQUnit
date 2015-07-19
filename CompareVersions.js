var compareVersions = function (a_,b_) {
  var a = a_.split('.').map(Number);
  var b = b_.split('.').map(Number);
  var upper = a.length>b.length?b.length:a.length;
  for (var i = 0; i < upper; i++) {
    if (a[i]>b[i]) return true;
    if (a[i]<b[i]) return false;
  };
  return (a.length>=b.length)?true:false;
};

module("CompareVersions")
 
  test("compareVersions('11', '10');        // returns true", function () {
    equal(compareVersions('11', '10'), true, "compareVersions('11', '10');        // returns true");
  });

  test("compareVersions('11', '11');        // returns true", function () {
    equal(compareVersions('11', '11'), true, "compareVersions('11', '11');        // returns true");
  });

  test("compareVersions('10.4.6', '10.4');  // returns true", function () {
    equal(compareVersions('10.4.6', '10.4'), true, "compareVersions('10.4.6', '10.4');  // returns true");
  });

  test("compareVersions('10.4', '11');      // returns false", function () {
    equal(compareVersions('10.4', '11'), false, "compareVersions('10.4', '11');      // returns false");
  });

  test("compareVersions('10.4', '10.10');   // returns false", function () {
    equal(compareVersions('10.4', '10.10'), false, "compareVersions('10.4', '10.10');   // returns false");
  });

  test("compareVersions('10.4.9', '10.5');  // returns false", function () {
    equal(compareVersions('10.4.9', '10.5'), false, "compareVersions('10.4.9', '10.5');  // returns false");
  });
  
  test("compareVersions('10.5.9', '10.5');  // returns true", function () {
    equal(compareVersions('10.5.9', '10.5'), true, "compareVersions('10.5.9', '10.5');  // returns true");
  });
  
  test("compareVersions('10.5', '10.5.9');  // returns false", function () {
    equal(compareVersions('10.5', '10.5.9'), false, "compareVersions('10.5', '10.5.9');  // returns false");
  });