var triangleType = function (a,b,c) {
  var x = [a,b,c].sort(function(a, b) {
  return a - b;
  });
  if (x[0]+x[1]<=x[2]) return 0;
  if (x[0]*x[0]+x[1]*x[1]>x[2]*x[2]) return 1;
  if (x[0]*x[0]+x[1]*x[1]==x[2]*x[2]) return 2;
  return 3;
};

module("TriangleType")

  test("triangleType(2, 4, 6); // return 0 (Not triangle)", function() { 
    equal(triangleType(2, 4, 6), 0, "triangleType(2, 4, 6); // return 0 (Not triangle)");
  });
  
  test("triangleType(8, 5, 7); // return 1 (Acute, angles are approx. 82°, 38° and 60°)", function() { 
    equal(triangleType(8, 5, 7), 1, "triangleType(8, 5, 7); // return 1 (Acute, angles are approx. 82°, 38° and 60°)");
  });
  
  test("triangleType(3, 4, 5); // return 2 (Right, angles are approx. 37°, 53° and exactly 90°)", function() { 
    equal(triangleType(3, 4, 5), 2, "triangleType(3, 4, 5); // return 2 (Right, angles are approx. 37°, 53° and exactly 90°)");
  });

  test("triangleType(7, 12, 8); // return 3 (Obtuse, angles are approx. 34°, 106° and 40°)", function() { 
    equal(triangleType(7, 12, 8), 3, "triangleType(7, 12, 8); // return 3 (Obtuse, angles are approx. 34°, 106° and 40°)");
  });
  
 