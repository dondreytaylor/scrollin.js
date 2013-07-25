Scrollin.js
===========

Scrollin.js is a quick and simple way to add infinite scrolling functionality anywhere. 
Complete with a fully-featured and flexible library, Scrollin.js is a plugin/JS module with the sole purpose of 
simplifying the way infinite scrolling is done. 

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

    <script type="text/javascript" src=""></script>

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

#### JQuery

    $('#selector').scrollin({
        fetch: 'http://sitewithstuff/.../stuff.json'
    });


#### Javascript

    Scrollin.init( document.getElementById('#selector'), { 
        fetch: 'http://sitewithstuff/.../stuff.json'  
    }); 
