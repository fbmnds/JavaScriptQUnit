var hamming = function(a,b) {
  var x = 0;
  for (var i = 0; i < a.length; i++) 
    if (a[i] == b[i]) x++;
  return a.length-x;
};

module("Hamming")
                 1234567890
  test("hamming('I like turtles','I like turkeys') //returns 3", function () {
    equal(hamming("I like turtles","I like turkeys"), 3, "hamming('I like turtles','I like turkeys') //returns 3");
  });