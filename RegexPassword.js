function validateRE(password) {
  if (password.length < 6) return false;
  if (password.match(/[^(a-z,A-Z,0-9)]/) !== null) return false;
  var x = password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6}/);
  if (x == null) return false;
  if (x === 'undefined') return false;
  if (x[0].length == 6) return true;
  return false;
};

module("RegexPassword")

  test('djI38D55 - Expected true', function () {
    equal(validateRE('djI38D55'), true, 'djI38D55 - Expected true')
  });
  
  test('a2.d412 - Expected false', function () {
    equal(validateRE('a2.d412'), false, 'a2.d412 - Expected false')
  });
  
  /*
Test.expect(validate('djI38D55'), 'djI38D55 - Expected true');
Test.expect(!validate('a2.d412'), 'a2.d412 - Expected false');
Test.expect(!validate('JHD5FJ53'), 'JHD5FJ53 - Expected false');
Test.expect(!validate('!fdjn345'), '!fdjn345 - Expected false');
Test.expect(!validate('jfkdfj3j'), 'jfkdfj3j - Expected false');
Test.expect(!validate('123'), '123 - Expected false');
Test.expect(!validate('abc'), 'abc - Expected false');
Test.expect(validate('Password123'), 'Password123 - Expected true');
*/