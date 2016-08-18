$(function() {
    function count1($this){
        var current = parseInt($this.html(), 10);
        current = current + 1; // set the interval

    $this.html(++current);
      if(current > $this.data('count1')){
          $this.html($this.data('count1'));
      } else {    
          setTimeout(function(){count1($this)}, 40); //set the timeout
      }
    } 

     function count2($this){
        var current = parseInt($this.html(), 10);
        current = current + 35; // set the interval

    $this.html(++current);
      if(current > $this.data('count2')){
          $this.html($this.data('count2'));
      } else {    
          setTimeout(function(){count2($this)}, 40); // set the timeout
      }
    }        

$(".country-stat").each(function() {
  $(this).data('count1', parseInt($(this).html(), 10));
  $(this).html('0');
  count1($(this));
 });

$(".case-stat").each(function() {
  $(this).data('count2', parseInt($(this).html(), 10));
  $(this).html('0');
  count2($(this));
 });

});