function insert_at_indexes(phrase,word,indexes){
  for (var i=indexes.length-1;i > -1; i--)
    phrase=phrase.slice(0,indexes[i]) + word + phrase.slice(indexes[i]);
  return phrase;
}

module ("InsertAtIndexes")

  test("James Likes Jane Failed to insert ' Likes'", function () {
    equal(insert_at_indexes("James Jane"," Likes",[5]), "James Likes Jane", "James Likes Jane Failed to insert ' Likes'")
  });
    
  test("'I' write a wi' said Phi, 'll', [3,14,24]), // => 'I'll write a will' said Phill", function () {
    equal(insert_at_indexes("'I' write a wi' said Phi", "ll", [3,14,24]), "'I'll write a will' said Phill", "Failed to insert 'll' multiple times correctly")
  });  
  
/*
Test.expect(insert_at_indexes("James Jane"," Likes",[5])=="James Likes Jane","Failed to insert ' Likes'")
Test.assertEquals(insert_at_indexes("James Jane"," Likes",[5]), "James Likes Jane", "Failed to insert ' Likes'");
Test.assertEquals(insert_at_indexes("'I' write a wi' said Phi","ll",[3,14,24]), "'I'll write a will' said Phill", "Failed to insert 'll' multiple times correctly");
*/