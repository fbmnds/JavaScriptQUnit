var nextFiveDays = function (date) {
  var day = date.getTime(),
    dates = [],
    curr = date;
  for (var i = 1; i < 6; i++) {
    curr.setTime(day+i*1000*60*60*24);
    dates.push((curr.getMonth()+1)+'/'+curr.getDate()+'/'+curr.getFullYear());
  };
  
  return dates.join(', ');
};


module("DangerousDates")
 
  test("nextFiveDays(new Date(2013,3,12)) // => '4/13/2013, 4/14/2013, 4/15/2013, 4/16/2013, 4/17/2013'", function () {
    equal(nextFiveDays(new Date(2013,3,12)), "4/13/2013, 4/14/2013, 4/15/2013, 4/16/2013, 4/17/2013", 
                "nextFiveDays(new Date(2013,3,12)) // => '4/13/2013, 4/14/2013, 4/15/2013, 4/16/2013, 4/17/2013'");
  });
    
    
    // 3/15/2012, 3/16/2012, 3/17/2012, 3/18/2012, 3/19/2012, instead got: 
    // 2/15/2012, 2/16/2012, 2/17/2012, 2/18/2012, 2/19/2012