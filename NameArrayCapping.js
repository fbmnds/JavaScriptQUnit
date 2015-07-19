function capMe(names) {
  String.prototype.toJadenCase = function () {
    return this.replace(/(^|\s)[a-z]/g, function(x){ return x.toUpperCase(); });
  };
  return names.map(function(x){return x.toLowerCase();}).map(function(x){return x.toJadenCase()});
};



module("NameArrayCapping")
  
  test("['jo', 'nelson', 'jurie']", function () {
    deepEqual(capMe(['jo', 'nelson', 'jurie']), ['Jo', 'Nelson', 'Jurie'], "passed");
  });
  
  test("['KARLY', 'DANIEL', 'KELSEY']", function () {
    deepEqual(capMe(['KARLY', 'DANIEL', 'KELSEY']), ['Karly', 'Daniel', 'Kelsey'], "passed");
  });
   