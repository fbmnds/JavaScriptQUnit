/*
var trainingSet = [[2, 1], [2, 4], [5, 4], [5, 8], [9, 8], [9, 11]];

The result of J(trainingSet, 0.5, 1) would be 1.625.
To find that, we first take the ∑ sum of (h(x) - y)^2 for every x,y pair in our training set.

The first one would be, ((0.5 + 2) - 1)^2 = 2.25
The second one would be, ((0.5 + 2) - 4)^2 = 2.25
The third one would be, ((0.5 + 5) - 4)^2 = 2.25
The fourth one would be, ((0.5 + 5) - 8)^2 = 6.25
The fifth one would be, ((0.5 + 9) - 8)^2 = 6.25
The sixth and final one would be, ((0.5 + 9) - 11)^2 = 0.25

The ∑ sum of these values is 19.5
Then we multiply 1/2m * 19.5, where m is 6 (number of x,y pairs in our training set) = 1.625
Therefore, J(trainingSet, 0.5, 1) = 1.625.
*/

var J = function (trainingSet, t1, t2) {
  var x = (0.5/trainingSet.length)*trainingSet.reduce(function(p,c){ return p + Math.pow(t1 + t2 * c[0] - c[1], 2);},0);
  return Number(x.toFixed(3));
};

module ("SimpleLinearRegression")
  
  var trainingSet = [[2, 1], [2, 4], [5, 4], [5, 8], [9, 8], [9, 11]];
  
  test("J([[2, 1], [2, 4], [5, 4], [5, 8], [9, 8], [9, 11]], 0.5, 1) = 1.458", function () {
    equal(J(trainingSet, 0.5, 1.0), 1.458, "J([[2, 1], [2, 4], [5, 4], [5, 8], [9, 8], [9, 11]], 0.5, 1) = 1.458")
  });