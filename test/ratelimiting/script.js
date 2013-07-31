
$(function() { 

    /*// Custom Events JQuery
    var $i = $('#navi');
    $i.on('sc:e',function() { 
        console.log('great');
    }); 

    var e = new Event('sc:e'); 
    var i = document.getElementById('navi');
    i.dispatchEvent(e); 

    */

    // Local Storage
    var supports_html5_storage  = function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } 
        catch (e) {
            return false;
        }
    };


    if(supports_html5_storage()) { 

        //localStorage.setItem('store1','value1');
        //localStorage.getItem('store1'); 
    }

    var $results = $('#results'); 
    var $viewport = $('#viewport'); 
    var i = 0; 

    var aj1 = function(action) { 
        return $.get('http://dondrey.devo.purzue.com/rest',{return_as:"jsonp",action:"test",controller:"test"},function(response) {
            
            var $newresults = $('<div></div>'); 
            var $result; 
            action = action === 'prepend' ? 'prepend' : 'append' ; 
            response = $.parseJSON(response);
            
            for(var r in response.test) { 
                $result = $(response.test[r]); 
                $newresults.append($result.html(++i));
            }
            

            $viewport.scrollTop($viewport.scrollTop() + $result.height() * response.test.length);
            $results[action]($newresults.html()); 

        },"JSONP"); 
    }; 
    var scrollinmore =    function() { 
        
        var pxToBeScrolled = $(this).get(0).scrollHeight; 
        var pxScrolled = $(this).scrollTop(); 
        var viewportHeight = $(this).height(); 

       // console.log('Pixels scrolled: ',pxScrolled);
       // console.log('Pixels to be scrolled: ',pxToBeScrolled - viewportHeight); 
       // console.log('Viewport Height: ',viewportHeight); 

       if  ( pxScrolled/pxToBeScrolled >= .5 ) { 
       
           aj1();
       
       } 
    };
    var opscrollinmore =    function() { 
        
        var pxToBeScrolled = $(this).get(0).scrollHeight; 
        var pxScrolled = $(this).scrollTop(); 
        var viewportHeight = $(this).height(); 

       // console.log('Pixels scrolled: ',pxScrolled);
       // console.log('Pixels to be scrolled: ',pxToBeScrolled - viewportHeight); 
       // console.log('Viewport Height: ',viewportHeight); 

       if  ( pxScrolled/pxToBeScrolled <= .5 ) { 
       
           aj1('prepend');
       
       } 
    };

    $viewport.on('scroll',opscrollinmore ); 

    aj1(); 



}); 