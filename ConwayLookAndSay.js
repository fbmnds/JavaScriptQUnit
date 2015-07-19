/*
Conway's Look-and-say sequence goes like this:

    Start with a number.
    Look at the number, and group consecutive digits together.
    For each digit group, say the number of digits, then the digit itself.

This can be repeated on its result to generate the sequence.

For example:

    Start with 1.
    There is one 1 --> 11
    Start with 11. There are two 1 digits --> 21
    Start with 21. There is one 2 and one 1 --> 1211
    Start with 1211. There is one 1, one 2, and two 1s --> 111221
*/

var conway = function (n) {
  var x = n.toString().split('').map(Number);
  var z = x.reduce(function(p,c){ if (p[p.length-1].indexOf(c) > -1) {p[p.length-1].push(c)} else {p.push([c]);} return p; }, [[]]);
  var res = '';
  for (var i = 1; i < z.length; i++) 
    res += (z[i].length).toString()+(z[i][0]).toString();
  return res;
  };

module ("ConwayLookAndSay")

  test("0 --> 10", function () {
    equal(conway(0), 10, "0 --> 10")
  });

  test("2014 --> 12101114", function () {
    equal(conway(2014), 12101114, "2014 --> 12101114")
  });

  test("9000 --> 1930", function () {
    equal(conway(9000), 1930, "9000 --> 1930")
  });
  
  test("22322 --> 221322", function () {
    equal(conway(22322), 221322, "22322 --> 221322")
  });
  
  test("222222222222 --> 122", function () {
    equal(conway(222222222222), 122, "222222222222 --> 122")
  });
  