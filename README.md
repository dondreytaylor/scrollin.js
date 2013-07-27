Scrollin.js
===========

Scrollin.js is a quick and simple way to add infinite scrolling functionality anywhere. Complete with a fully-featured and flexible library, Scrollin.js is a plugin/JS module with the sole purpose of simplifying the way infinite scrolling is done. 

### What is Infinite Scrolling? 

As web interface design progresses and the world of single page app like sites emerge,
new ways for fetching and presenting data in one almost seamless, realtime fashion needed
to be developed. The predominant method is through the use of infinite scrolling. Also referred to as 
endless pages or autopagerize; Infinite scrolling is the process by which content from subsequent pages is added to the end-users current page as they  
progress vertically, horizontally, or triggered by performing some action. 
Examples of this can be seen across the web on sites like Facebook, Twitter, Pinterest, 
Flipboard, and Flickr to name the most popular.

## Getting Things Scrollin

Setting up Scrollin is as easy as including the following line
in your code.

```javascript
<script type="text/javascript" src=""></script>
```

If you are using Scrollin.js as a jQuery plugin, be sure to use the jQuery version
of Scrollin and include [JQuery](http://jQuery.com/ "jQuery") 1.9+, which **must** be
loaded prior to Scrollin.js.

    <script type="text/javascript" src=""></script>
    <script type="text/javascript" src=""></script>


## Examples

For examples of Scrollin.js in use, check out our [examples page](http://scrollinjs.com/version/examples "Scrollin JS Examples") at <http://scrollinjs.com/> 


## What seperates Scrollin.js from the Rest?

The focus of Scrollin.js is to provide a clean, flexible, lightweight and robust infinite scroll solution that
can be implememted across the web with minimal effort. Scrollin.js is all about flexibility, with a variety of
different options that can be configured, custom events, and handlers that can be used to your liking. 


## Features

+ Loads content to a specified element as the end-user scrolls
+ Allows for data to be loaded from more than one remote source
+ Works with custom templates for results
+ Custom events that can be listened to, for performing various logic
+ Supports vertical and horizontal scrolling
+ Caching of results (local storage or via javascript)
+ Wide range of event handlers
+ Works nicely with libraries such as [Masonry](http://masonry.desandro.com/ "Masonry") 

## Usage

### Basic Use

You can attach Scrollin to virtually any element by specifying its selector. Specifying the `fetch` option will tell
Scrollin where to fetch the results from. 

##### JQuery

    $('#selector').scrollin({
        fetch: '../results.json'
    });


##### Javascript

    Scrollin.init( document.getElementById('#selector'), { 
        fetch: '../results.json'  
    }); 




## Configurations


### scID

Used to reference any instance of Scrollin being used. To retrieve an instance
use the `i` function with the `scID` value passed in. 

##### JQuery
    
    // Setting ID
    $('#selector').scrollin({
        scID:1
    });

    // Retrieving instance
    Scrollin.i(1) 

##### Javascript
    
    // Setting ID
    Scrollin.init( document.getElementById('#selector'), { 
       scID:1
    }); 

    // Retrieving instance
    Scrollin.i(1)




### Fetch

The remote path containing the data to be fetched. Scrollin will first try to fetch
from `local` storage and `cache` depending if enabled, and only if both are unable to provide
results will a request be made. Scrollin reduces the amount of requests sent out at a given time by 
limiting the amount of active requests. 

For additional configuration the `fetch` option provides the following: 

+ `url` - The URL is where results will be pulled from. A request is only made here when `local` cannot be used. URL can also be a function that returns a string.

+ `dataType` - This is the type of data we will be expected from the response. By default all `json` is used.

+ `timeout` - The amount of time we will wait on a given request to return with results.

+ `cache` - Browser caching of results

+ `local` - Local Storage caching of results

##### JQuery
    
    $('#selector').scrollin({
        fetch:'../results.json'
    });

    // or

    $('#selector').scrollin({
        fetch: {url:"../results.json",cache:true,local:true}
    });

##### Javascript
    
    Scrollin.init({
        fetch:'../results.json'
    });

    // or

    Scrollin.init({
        fetch: {url:"../results.json",cache:true,local:true}
    });




### Template

The template will be used to render each of the results passed back. The template can be a string
or precompiled template if a `templateEngine` is specified. If a template is not specified each result will be assumed to be markup and contained within a `div` element (e.g. `<div>result markup</div>`)

##### JQuery
    
    // Template without Engine
    $('.selector').scrollin({ 
        scID: 0,
        fetch: '../results.json',
        template: function(result,context) { 
            return "<li><img src='"+result.src+"' title='"+result.title+"' /></li>"; 
        },
    });


    // Template with Engine
    $('.selector').scrollin({ 
        scID: 0,
        fetch: '../results.json',
        template: function(result,context) { 
            return "<li><img src='{{result.src}}' title='{{result.title}}' /></li>"; 
        },
        templateEngine: Hogan 
    });


##### Javascript
    
    // Template without Engine
    Scrollin.init({ 
        scID: 0,
        fetch: '../results.json',
        template: function(result,context) { 
            return "<li><img src='"+result.src+"' title='"+result.title+"' /></li>"; 
        },
    });


    // Template with Engine
    Scrollin.init({ 
        scID: 0,
        fetch: '../results.json',
        template: function(result,context) { 
            return "<li><img src='{{result.src}}' title='{{result.title}}' /></li>"; 
        },
        templateEngine: Hogan 
    });    



### Debug

Used for development purposes. By enabling `debug` results will be stored in within a log. 

For additional configuration the `debug` option provides the following: 

+ `console` - Determines whether to console.log the state
+ `cache`   - Determines whether to cache the log for later use


##### JQuery
    
    // Setting debug
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        debug: true
    });

    // Setting additional options
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        debug: {console:true,cache:true}
    });


##### Javascript
    
    // Setting debug
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        debug: {console:true,cache:true}
    });




### Limit

The amount of results shown per page. **Note** If the number of results sent back is greater than limit, Scrollin will only show up to the limit value.

For additional configuration the `debug` option provides the following: 

+ `count` - number of results to show. If no limit is set or the limit is invalid, no limit will be applied.
+ `passOnRequest` - Determines whether append the limit value on each request to `fetch` results.

##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        limit: 20
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        debug: {count:20,passOnRequest:30}
    });

### DataToPass

The data to be passed on each `fetch` for results. An Object or function returning an object is expected.


##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        dataToPass: function() { 
            return {whatsup:"API"};
        }
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        dataToPass: function() { 
            return {whatsup:"API"};
        }
    });



### ScrollSpeed

The speed at which the user can scroll vertically or horizontally. The options
that can be specified are 'fast','slow','normal'. By Default `normal` will be used.

For additional configuration the `scrollSpeed` option provides the following: 

+ px - specify the amount of additional pixels to be scrolled


##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        scrollSpeed: 'fast'
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        scrollSpeed: {px:40}
    });



### Reverse

Adds results opposite the default axis direction. If the axis is horizontal results will be
prepended opposite bottom. If the axis is vertical results will be prepended opposite right.

##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        reverse: true
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        reverse: true
    });  


### Axis

The `axis` option specifies the direction that the end-user will be scrolling in either `x` (left,right) or
`y` (top,bottom).

##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'x'
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y'
    });  


### Animate

**(ONLY JQUERY)** The `animate` option will fade in the results upon append/prepend depending on the `axis` set.

For additional configuration the `animate` option provides the following: 

+ `speed` - duration of animate. (In milliseconds or 'fast','slow')

+ `delay` - amount of time to wait before animating the result. (In milliseconds) 

+ `callback` - Function to be called after result finishes animating.

+ `custom` - A custom implementation of animate. Signature for this function is as follows `custom(result,context)`. All other options will be ignored.



##### JQuery
    
    // Animate w/ defaults
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        animate: true
    });

    
    // Animate w/ settings
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        animate: { 
            speed:50,
            delay:10
        }
    });

    // Custom Animation
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        animate: {
            custom: function(result,context) {
                return result.animate({opacity:1});  
            }
        }
    });


### Loading

If results are not ready to be appended/prepended, a loading image will display in the direction
of the end-users scroll. 

##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        loading: { 
            img: '../loading.gif'
        }
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        loading: { 
            img: '../loading.gif'
        }
    }); 


### Done

If there is no more reults to display, and image or text will appear in the direction of the 
end-users scroll. 

##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        done: { 
            text: 'You have reached the end.'
        }
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        done: { 
            text: 'You have reached the end.'
        }
    }); 


### FillOnLoad

Results will fill the scroll target element until the content is equal to or exceeds
the scroll target. 

##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        fillOnLoad: true
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        fillOnLoad: true
    }); 


### Data

Pass data between handlers using the `data` option. 

##### JQuery
    
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        data: {messaage:"A message to send each handler"},
        onBeforeFetch(dataToPass,context) {
            console.log(context.message); 
        }
    });


##### Javascript
    
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        data: {messaage:"A message to send each handler"},
        onBeforeFetch(dataToPass,context) {
            console.log(context.message); 
        }
    }); 



### UpdateURL

Get triggered when the end-user scrolls to a particular page. A page is defined as reached
when the first element of that page first becomes visible in the scroll target.
**Note** Specifying an invalid value or specifying false will disable url updating.


##### JQuery
    
    // Default (i.e /page/<number>)
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        updateURL: true
    });


    // Custom URL
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        updateURL: function(pattern,context) {
             return '/page/'+context.states.pageNumber; 
        }
    });


##### Javascript
    
    // Default (i.e /page/<number>)
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        updateURL: true
    });


    // Custom URL
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        updateURL: function(pattern,context) {
             return '/page/'+context.states.pageNumber; 
        }
    });

### ResultsHolder

The results holder is the element to append/prepend results to. By default the `resultsHolder` is the `scrollTarget`.

##### JQuery
    
    // Default (i.e /page/<number>)
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        results
    });


    // Custom URL
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        updateURL: function(pattern,context) {
             return '/page/'+context.states.pageNumber; 
        }
    });


##### Javascript
    
    // Default (i.e /page/<number>)
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        updateURL: true
    });


    // Custom URL
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        updateURL: function(pattern,context) {
             return '/page/'+context.states.pageNumber; 
        }
    });



### ResultDataAtrr

Scrollin will add attributes to each individual result which can be enabled or disabled.

##### JQuery
    
    // Default (i.e /page/<number>)
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        resultDataAtr: false
    });


    // Custom URL
    $('#selector').scrollin({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        resultDataAtrr: false
    });


##### Javascript
    
    // Default (i.e /page/<number>)
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        resultDataAtrr: false
    });


    // Custom URL
    Scrollin.init({
        scID: 0,
        fetch: '../results.json',
        axis: 'y',
        resultDataAtrr: false
    });