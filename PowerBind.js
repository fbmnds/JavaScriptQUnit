var func = function () {
  return this.prop;
};
var obj1 = {prop: 1},
    obj2 = {prop: 2};

func = func.bind(obj1);
//alert(func()); // Will produce 1

func = func.bind(obj2);
//alert(func()); // Will also produce 1 :(