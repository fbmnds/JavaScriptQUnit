// var isNum = function (value) {
	// return (value instanceof Number || typeof value === 'number') && !isNaN(value);
// };
// var isInt = function (n) {
	// return isNum(n) && isFinite(n) && n % 1 === 0;
// };

var getArray = function (args) {
	var start = args[0];
	var start2 = args[1];
	var end = args[2];
	var x = [];
	var delta = start2 - start;
	if (delta > 0) {
		if (start <= end)
			x.push(start);
		for (var i = start + delta; i <= end; i += delta)
			x.push(i);
	}
	if (delta < 0) {
		if (start >= end)
			x.push(start);
		for (var i = start + delta; i >= end; i += delta)
			x.push(i);
	};
	return x;
};

function ArrayComprehension(options) {
	if (typeof options === 'undefined') return [];
	if (typeof options.generator === 'undefined') return [];
	if (options.generator.match(/^\s*\d+\s*$/)) return [Number(options.generator)];
	if (options.generator.match(/^\s*\d+\s*,\s*\d+\s*$/)) return options.generator.split(',').map(Number);
	if (options.generator.match(/^\s*\d+\s*\.\.\s*\d+\s*$/)) {
		var z = options.generator.split('..').map(Number);
    
		if (z[0] > z[1]) { return []; }
	  return getArray([z[0], z[0] + 1, z[1]]);
	};
  if (options.generator.match(/^\s*\d+\s*,\s*\d+\s*\.\.\s*\d+\s*$/)) {
    var x = options.generator.split(',');
    var z = x[1].split('..');
    return getArray([x[0], z[0], z[1]].map(Number));
  };
  var x = options.generator.split(',');
  if (x.length > 2) return x.map(Number);
  return [];
};

		
module("HaskellListDotNotation")

  test("ArrayComprehension({generator: '1,4,-3'}); // returns [1,4,-3]", function () {
    deepEqual(ArrayComprehension({
        generator : '1,4,-3'
      }), [1, 4, -3], "ArrayComprehension({generator: '1,4,-3'}); // returns [1,4,-3]")
  });

  test("ArrayComprehension({generator: '1..5'}); // returns [1,2,3,4,5]", function () {
    deepEqual(ArrayComprehension({
        generator : '1..5'
      }), [1, 2, 3, 4, 5], "ArrayComprehension({generator: '1..5'}); // returns [1,2,3,4,5]")
  });

  test("ArrayComprehension({generator: '1,3..7'}); // returns [1,3,5,7]", function () {
    deepEqual(ArrayComprehension({
        generator : '1,3..7'
      }), [1, 3, 5, 7], "ArrayComprehension({generator: '1,3..7'}); // returns [1,3,5,7]")
  });

  test("ArrayComprehension({generator: '7,5..2'}); // returns [7,5,3]", function () {
    deepEqual(ArrayComprehension({
        generator : '7,5..2'
      }), [7, 5, 3], "ArrayComprehension({generator: '7,5..2'}); // returns [7,5,3]")
  });

  test("ArrayComprehension({generator: ' 1   ,  4  '}), [ 1,4]", function () {
    deepEqual(ArrayComprehension({
        generator : ' 1   ,  4  '
      }), [1, 4], "ArrayComprehension({generator: ' 1   ,  4  '}), [ 1,4]")
  });

  test("ArrayComprehension({generator: ''}), []", function () {
    deepEqual(ArrayComprehension({
        generator : ''
      }), [], "ArrayComprehension({generator: ''}), []")
  });

  test("ArrayComprehension({}), []", function () {
    deepEqual(ArrayComprehension({}), [], "ArrayComprehension({}), []")
  });

  test("ArrayComprehension({generator: '    '}), []", function () {
    deepEqual(ArrayComprehension({
        generator : '    '
      }), [], "ArrayComprehension({generator: '    '}), []")
  });

  test("ArrayComprehension({generator: '  1   '}), [1]", function () {
    deepEqual(ArrayComprehension({
        generator : '  1   '
      }), [1], "ArrayComprehension({generator: '  1   '}), [1]")
  });

  test("ArrayComprehension({generator: '1,4'}), [1,4]", function () {
    deepEqual(ArrayComprehension({
        generator : '1,4'
      }), [1, 4], "ArrayComprehension({generator: '1,4'}), [1,4]")
  });

  test("ArrayComprehension({generator: ' 1   ,  4  '}), [1,4]", function () {
    deepEqual(ArrayComprehension({
        generator : ' 1   ,  4  '
      }), [1, 4], "ArrayComprehension({generator: ' 1   ,  4  '}), [ 1,4]")
  });

  test("ArrayComprehension({generator: '1,4,6,3,-2'}), [1,4,6,3,-2]", function () {
    deepEqual(ArrayComprehension({
        generator : '1,4,6,3,-2'
      }), [1, 4, 6, 3, -2], "ArrayComprehension({generator: '1,4,6,3,-2'}), [1,4,6,3,-2]")
  });

  test("ArrayComprehension({generator: '3,2..2'}), [3,2]", function () {
    deepEqual(ArrayComprehension({
        generator : '3,2..2'
      }), [3, 2], "ArrayComprehension({generator: '3,2..2'}), [3,2]")
  });

  test("ArrayComprehension({generator: '5..3'}), []", function () {
    deepEqual(ArrayComprehension({
        generator : '5..3'
      }), [], "ArrayComprehension({generator: '5..3'}), []")
  });

  test("ArrayComprehension({generator: '1,90..80'}), [1]", function () {
    deepEqual(ArrayComprehension({
        generator : '1,90..80'
      }), [1], "ArrayComprehension({generator: '1,90..80'}), [1]")
  });

  test("ArrayComprehension({generator: '1..5'}), [1,2,3,4,5]", function () {
    deepEqual(ArrayComprehension({
        generator : '1..5'
      }), [1,2,3,4,5], "ArrayComprehension({'1..5'}), [1,2,3,4,5]")
  });
  
		/*
		ArrayComprehension({generator: '1,4,-3'}); // returns [1,4,-3]
		ArrayComprehension({generator: '1..5'}); // returns [1,2,3,4,5]
		ArrayComprehension({generator: '1,3..7'}); // returns [1,3,5,7]
		ArrayComprehension({generator: '7,5..2'}); // returns [7,5,3]

		Test.describe("ArrayComprehension tests", function() {

		Test.it("Empty list test", function() {
		var list = ArrayComprehension({generator: ''});
		Test.assertSimilar(list, []);
		Test.assertSimilar(ArrayComprehension({}), []);
		Test.assertSimilar(ArrayComprehension({generator: '    '}), []);
		});

		Test.it("One element test", function() {
		var list = ArrayComprehension({generator: '1'});
		Test.assertSimilar(list, [1]);
		});

		Test.it("Two elements test", function() {
		Test.assertSimilar(ArrayComprehension({generator: '1,4'}), [1,4]);
		Test.assertSimilar(ArrayComprehension({generator: ' 1   ,  4  '}), [ 1,4]);
		});

		Test.it("Multiple elements test", function() {
		Test.assertSimilar(ArrayComprehension({generator: '1,4,6,3,-2'}), [1,4,6,3,-2]);
		});

		Test.it("Range tests", function() {
		Test.assertSimilar(ArrayComprehension({generator: '1,3..4'}), [1,3]);
		Test.assertSimilar(ArrayComprehension({generator: '1,2..2'}), [1,2]);
		Test.assertSimilar(ArrayComprehension({generator: '3,2..2'}), [3,2]);
		Test.assertSimilar(ArrayComprehension({generator: '5..3'}), []);
		Test.assertSimilar(ArrayComprehension({generator: '90..80'}), []);
		//Test.assertSimilar(ArrayComprehension({generator: '8,4..40'}), [8]);
		Test.assertSimilar(ArrayComprehension({generator: '1,90..80'}), [1]);
		Test.assertSimilar(ArrayComprehension({generator: '1..5'}), [1,2,3,4,5]);
		Test.assertSimilar(ArrayComprehension({generator: '1,4..12'}), [1,4,7,10]);
		Test.assertSimilar(ArrayComprehension({generator: '12,10..4'}), [12,10,8,6,4]);
		});

		});

		 */
