/*
Description:

In this kata, you'll have to implement a function solve_graph(start, end, arcs) that will return true if the end node can be reached from the start node, using 0 or more arcs. It will return false if it is not possible.

The graph is defined by a list of arcs, where each arc is an object that has two properties, start and end, representing the start and end nodes, respectively. Each arc is unidirectional, in other words it goes from a start node to an end node, and not the other way around. Note that 0 or more arcs can leave a node, and 0 or more can arrive to it. If you need more info on the way these graphs work, you can see there : http://en.wikipedia.org/wiki/Adjacency_list and there : http://en.wikipedia.org/wiki/Directed_graph

Note that the solve_graph() method doesn't take a list of nodes as input: for simplicity's sake, let's assume that all nodes present in arcs are valid. However, the start or end node may not be in arcs.
*/

var solve_graph = function (a,b,g) {
  if (a == b) return true;
  var reachable = [];
  var found = false;
  var searchGraph = function (c,target) {
    for (var i = 0; i < g.length; i++) {
      if (g[i].start == c) {
        if (g[i].end == target) {
          found = true;
          return;
        } else {
          if (reachable.indexOf(g[i].end) == -1) {
            reachable.push(g[i].end);
            searchGraph(g[i].end,target);
          };
        };
      };
    };
    return;
  };
  searchGraph(a,b);
  return found;
};


module ("SolveGraph")
  
  var arcs = [
    { start : "a", end : "b" },
    { start : "a", end : "a"}
  ];

  var arcs2 = [
    { start: "a", end: "b"},
    { start: "b", end: "c"},
    { start: "c", end: "a"},
    { start: "c", end: "d"},
    { start: "e", end: "a"}
  ];
  
  test('solve_graph("a", "b", arcs) // => true', function () {
    equal(solve_graph("a", "b", arcs), true, 'solve_graph("a", "b", arcs) // => true')
  });
  
  test('solve_graph("a", "c", arcs) // => false', function () {
    equal(solve_graph("a", "c", arcs), false, 'solve_graph("a", "c", arcs) // => false')
  });
  
  test('solve_graph("a", "a", arcs) // => true', function () {
    equal(solve_graph("a", "a", arcs), true, 'solve_graph("a", "a", arcs) // => true')
  });
  
  test('solve_graph("a", "d", arcs2) // => true', function () {
    equal(solve_graph("a", "d", arcs2), true, 'solve_graph("a", "d", arcs2) // => true')
  });
  
  test('solve_graph("a", "e", arcs2) // => false', function () {
    equal(solve_graph("a", "e", arcs2), false, 'solve_graph("a", "e", arcs2) // => false')
  });
  
  test('solve_graph("a", "a", arcs2) // => true', function () {
    equal(solve_graph("a", "a", arcs2), true, 'solve_graph("a", "a", arcs2) // => true')
  });
  
  test('solve_graph("a", "b", arcs2) // => true', function () {
    equal(solve_graph("a", "b", arcs2), true, 'solve_graph("a", "b", arcs2) // => true')
  });
  
  test('solve_graph("a", "c", arcs2) // => true', function () {
    equal(solve_graph("a", "c", arcs2), true, 'solve_graph("a", "c" arcs2) // => true')
  });
  
  
/*  
  describe("Simple graph with 1 arc", function() {
  var arcs = [
    { start: "a", end: "b" },
  ]
  it("Should reach b", function() {
    Test.assertEquals(solve_graph("a", "b", arcs), true);
  });
  it("Should never reach c", function() {
    Test.assertEquals(solve_graph("a", "c", arcs), false);
  });
  it("Should reach start state", function() {
    Test.assertEquals(solve_graph("a", "a", arcs), true);
  });
});

describe("Complex graph with loops and intermediary nodes", function() {
  var arcs = [
    { start: "a", end: "b"},
    { start: "b", end: "c"},
    { start: "c", end: "a"},
    { start: "c", end: "d"},
    { start: "e", end: "a"}
  ];
  it("Should reach d", function() {
    Test.assertEquals(solve_graph("a", "d", arcs), true);
  });
  it("Should never reach nodes with no arcs leading to it", function() {
    Test.assertEquals(solve_graph("a", "e", arcs), false);
  });
  it("Should reach all nodes in a loop", function() {
    Test.assertEquals(solve_graph("a", "a", arcs), true);
    Test.assertEquals(solve_graph("a", "b", arcs), true);
    Test.assertEquals(solve_graph("a", "c", arcs), true);
  });
});
*/  
  
// http://www.ics.uci.edu/~eppstein/161/960201.html  
/*
 test-connected(G)
    {
    choose a vertex x
    make a list L of vertices reachable from x,
    and another list K of vertices to be explored.
    initially, L = K = x.

    while K is nonempty
        find and remove some vertex y in K
        for each edge (y,z)
            if (z is not in L)
            add z to both L and K

    if L has fewer than n items
        return disconnected
    else return connected
    }
*/