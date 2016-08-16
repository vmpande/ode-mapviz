$(window).scroll(function(){
    
    // calculate how far we've scrolled down, by percentage
    var scrollTo = $(window).scrollTop(),
        docHeight = $(document).height(),
        windowHeight = $(window).height();
    scrollPercent = (scrollTo / (docHeight-windowHeight)) * 100;
    scrollPercent = scrollPercent.toFixed(1);
    scrollPercent = parseFloat(scrollPercent);

    
    var c1AnchorPos = $("#c1Anchor").offset();
        c2AnchorPos = $("#c2Anchor").offset();
        c3AnchorPos = $("#c3Anchor").offset();
        // c4AnchorPos = $("#c4Anchor").offset();
        

    var c1AnchorTop = c1AnchorPos.top;
        c2AnchorTop = c2AnchorPos.top;
        c3AnchorTop = c3AnchorPos.top;
        // c4AnchorTop = c4AnchorPos.top;
    

    var c1Percent = (c1AnchorTop / (docHeight-windowHeight)) * 100;
        c1Percent = c1Percent.toFixed(1);
        c1Percent = parseFloat(c1Percent);
    var c2Percent = (c2AnchorTop / (docHeight-windowHeight)) * 100;
        c2Percent = c2Percent.toFixed(1);
        c2Percent = parseFloat(c2Percent);
    var c3Percent = (c3AnchorTop / (docHeight-windowHeight)) * 100;
        c3Percent = c3Percent.toFixed(1);
        c3Percent = parseFloat(c3Percent);
    // var c4Percent = (c4AnchorTop / (docHeight-windowHeight)) * 100;
    //     c4Percent = c4Percent.toFixed(1);
    //     c4Percent = parseFloat(c4Percent);
   
    
    if(scrollPercent < c1Percent) {
        $('#c1').addClass('filled');
        $('#c2').removeClass('filled');
        $('#c3').removeClass('filled');
        $('#c4').removeClass('filled');
        // $('#c5').removeClass('filled');
    } else if((scrollPercent >= c1Percent) && (scrollPercent < c2Percent)) {
        $('#c1').removeClass('filled');
        $('#c2').addClass('filled');
        $('#c3').removeClass('filled');
        $('#c4').removeClass('filled');
        // $('#c5').removeClass('filled');
    } else if((scrollPercent >= c2Percent) && (scrollPercent < c3Percent)) {
        $('#c1').removeClass('filled');
        $('#c2').removeClass('filled');
        $('#c3').addClass('filled');
        $('#c4').removeClass('filled');
        // $('#c5').removeClass('filled');
    // } else if((scrollPercent >= c3Percent) && (scrollPercent < c4Percent)) {
    //     $('#c1').removeClass('filled');
    //     $('#c2').removeClass('filled');
    //     $('#c3').removeClass('filled');
    //     $('#c4').addClass('filled');
        // $('#c5').removeClass('filled');
    } else if (scrollPercent >= c3Percent) {
        $('#c1').removeClass('filled');
        $('#c2').removeClass('filled');
        $('#c3').removeClass('filled');
        $('#c4').addClass('filled');
        // $('#c5').addClass('filled');
    }
    
}).trigger('scroll');

// end of jquery script