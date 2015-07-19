// ['99 bottles of beer on the wall, 99 bottles of beer.',
// 'Take one down and pass it around, 98 bottles of beer on the wall.',
// '98 bottles of beer on the wall, 98 bottles of beer.',
// // and so on ...
// '3 bottles of beer on the wall, 3 bottles of beer.',
// 'Take one down and pass it around, 2 bottles of beer on the wall.',
// '2 bottles of beer on the wall, 2 bottles of beer.',
// 'Take one down and pass it around, 1 bottle of beer on the wall.',
// '1 bottle of beer on the wall, 1 bottle of beer.',
// 'Take one down and pass it around, no more bottles of beer on the wall.',
// 'No more bottles of beer on the wall, no more bottles of beer.',
// 'Go to the store and buy some more, 99 bottles of beer on the wall.'];

var sing = function () {
  // return the lyrics as a string ...
  var x = []
  for (i = 99; i > 2; i--) {
    x.push(i+' bottles of beer on the wall, '+i+' bottles of beer.');
    x.push('Take one down and pass it around, '+(i-1)+' bottles of beer on the wall.');
  }
  x.push('2 bottles of beer on the wall, 2 bottles of beer.');
  x.push('Take one down and pass it around, 1 bottle of beer on the wall.');
  x.push('1 bottle of beer on the wall, 1 bottle of beer.');
  x.push('Take one down and pass it around, no more bottles of beer on the wall.');
  x.push('No more bottles of beer on the wall, no more bottles of beer.');
  x.push('Go to the store and buy some more, 99 bottles of beer on the wall.');
  return x;
};