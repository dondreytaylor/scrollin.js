( function( window ) { 
	"use strict";

	var $ = window.jQuery; 
	var console = window.console;
	var browserHasConsole = typeof console !== undefined; 
	var instances = [];
	var index;
	var instance;  	

	///////////// HELPER /////////////////
	var Helpers = {
		extend: function( a,b ) {
			
			if( typeof a === 'object' && typeof b  === 'object' ) {
				
				for( var prop in b ) {
					a[ prop ] = b[ prop ]; 
				}
				
				return a;
			}

			return {}; 
		},
		isArray: function( obj ) {
			
			return Object.prototype.toString.call( obj ) === '[object Array]';
		},
		makeArray: function( obj ) {
		  var ary = [];
		  if ( this.isArray( obj ) ) { 
		  	ary = obj; 
		  } 
		  else if ( obj !== undefined && obj['length'] !== undefined && typeof obj.length === 'number' ) { 
		  	for ( var i=0, len = obj.length; i < len; i++ ) { 
		  		ary.push( obj[i] );
		  	}
		  } 
		  else { 
		  	ary.push( obj );
		  }
		  return ary;
		},
		getElementWidth: function( element ) {
			if ( typeof element === 'object' ) {
				if (typeof element.clip !== "undefined") {
			      return element.clip.width;
			    } 
			    else {
			        if (element.style.pixelWidth) {
			        	return element.style.pixelWidth;
			      	} 
			      	else {
			         	return element.offsetWidth;
			      		
			    	} 
				}
			}
		},
		getElementHeight: function( element ) {
			if ( typeof element === 'object' ) {
				if (typeof element.clip !== "undefined") {
			      return element.clip.height;
			    } 
			    else {
			        if (element.style.pixelHeight) {
			        	return element.style.pixelHeight;
			      	} 
			      	else {
			         	return element.offsetHeight;
			      		
			    	} 
				}
			}
		},
		getInstanceName: function( obj ) {
			for(var v in window){
				try{
					if(window[v] instanceof obj){
						return v;
					}
				}
				catch(e) {}
			};
			return false;
		},
		sendXHRRequest: function( url, method, sync, data, callback ) {

			var xhr;  
          	var i; 
          	var readyStateHandler;
          	var callbackSet;
          	var methods = ['GET','PUT','POST','DELETE'];

          	if(typeof XMLHttpRequest !== 'undefined')
        	{
				 xhr = new XMLHttpRequest();  
        	}
        	else 
        	{  
            	var versions = [
            		"MSXML2.XmlHttp.5.0",   
                    "MSXML2.XmlHttp.4.0",  
                    "MSXML2.XmlHttp.3.0",   
                    "MSXML2.XmlHttp.2.0",  
                    "Microsoft.XmlHttp"
                ]  
  
	            for(var i = 0, len = versions.length; i < len; i++) 
	            {  
	                try 
	                {  
	                    xhr = new ActiveXObject(versions[i]);  
	                    break;  
	                }  
	                catch(e)
	                {

	                }  
	            }  
	        }  
          
        	
        	// Check arguments
        	url    = typeof url === 'string' ? url : '';
        	sync   = typeof sync === 'boolean' ?  sync : true;
        	data   = typeof data === 'string' ? data : ''; 
        	method = typeof method === 'string' ? method : ''; 
        	callbackSet = typeof callback === 'function' ? true : false;
        	method = methods.join(',').indexOf(method) > -1 ? method : 'GET';

          
	        readyStateHandler = function() 
	        {
	        	/**
		         * 0: uninitialized
				 * 1: loading
				 * 2: loaded
				 * 3: interactive
				 * 4: complete
				 **/  

	            if(xhr.readyState < 4) 
	            {  
	                return;  
	            }  
	              
	            if(xhr.status !== 200) 
	            {  
	                return;  
	            }  
	  	
	  			// Success
	            if(xhr.readyState === 4) 
	            {  
	                callback(xhr);  
	            }             
	        }  
	        


	        if (!sync) 
	        {
	        	xhr.onreadystatechange = readyStateHandler;  
	        }

	        xhr.open(method, url, !sync);  
	        xhr.send(data);

	        return this;   
		},
		sendJSONP: function( url, callback ) {
			if (typeof url === 'string') 
			{ 
				if (typeof callback === 'function') 
				{ 
					Scrollin.callbacks.jsonp = callback; 
				}

				var script = document.createElement("script");
				script.src = url;
				document.body.appendChild(script); 
			}
			return this;
		},
		setFallbacksOnNoSupport: function() { 
			if (!window.JSON) { 
				window['JSON'] = {
			    parse: function (sJSON) { return eval("(" + sJSON + ")"); },
			    stringify: function (vContent) {
			      if (vContent instanceof Object) {
			        var sOutput = "";
			        if (vContent.constructor === Array) {
			          for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
			          return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
			        }
			        if (vContent.toString !== Object.prototype.toString) { return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\""; }
			        for (var sProp in vContent) { sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ","; }
			        return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
			      }
			      return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
			    }
				};
			}
			return this; 
		},
		urlifyObject: function( object, returningString ) { 
			
			returningString = typeof returningString === 'string' ? returningString : "";

			if (typeof object === 'object')
			{
				for(index in object) 
				{
					if (typeof object[index] === 'string')
					{
						if(returningString.length === 0)
						{
							returningString += index+'='+object[index];
						}
						else 
						{
							returningString += '&'+index+'='+object[index];
						}
					}
					else
					{
						if (typeof object[index] === 'object') 
						{
							Helpers.urlifyObject( object, returningString );
						}
						else 
						{
							return returningString; 
						}
					}
				}
			}
			
			return returningString;
		},
		validateJSONSchema: function(schema, json) { 
		}
	};

	// Set Fallback implementations if necessary
	Helpers.setFallbacksOnNoSupport(); 
	
	/////////////////////////////////////

	///////// DEFINE SCROLLIN ///////////
	var Scrollin = (function( elem, options ) {
		
		var handlers; 
		var defaults;
		var initializedEvent; 

		if ( !( this instanceof Scrollin ) ) { 
			instance = new Scrollin(elem, options);
			instances.push(instance);
			return instance;
		}

		if( typeof elem === 'string' ) { 
			
			elem = document.querySelectorAll( elem ); 
		}


		handlers = {
			onBeforeFetch:   { overridable: true,   stack: [],                   dispatchOn: '', },     
		    onFetch:         { overridable: true,   stack: [],                   dispatchOn: '', },                  
		    onFetchSuccess:  { overridable: true,   stack: [],                   dispatchOn: '', },    
		    onFetchFailure:  { overridable: true,   stack: [],                   dispatchOn: '', },   
		    onFetchWait:     { overridable: true,   stack: [],                   dispatchOn: '', },         
		    onParse:         { overridable: true,   stack: [this.onParse],       dispatchOn: '', },                  
		    onComplete:      { overridable: true,   stack: [],                   dispatchOn: '', },           
		    onScrolling:     { overridable: false,  stack: [this.onScrolling],   dispatchOn: 'scroll', },        
		    onQueueUpdate:   { overridable: false,  stack: [this.onQueueUpdate], dispatchOn: 'scrollin:queueupdate', },        
		    onInitialized:   { overridable: false,  stack: [this.onInitialized], dispatchOn: 'scrollin:initialized', },  
		    onStill:         { overridable: true,   stack: [],                   dispatchOn: '', },         	
		    onPageEnterView: { overridable: true,   stack: [],                   dispatchOn: '', },  
		    onPageLeaveView: { overridable: true,   stack: [],                   dispatchOn: '', }  
		};

		defaults  = {
			scID: (instances.length+1),    // - used as identifier
		    template: "", 			       // - markup for new elements
		    templateEngine: "", 	       // - engine used for markup
		    fetch: "", 				       // - url where we will be fetching 
		    debug: "", 				       // - used for development purposes
		    limit: "", 				       // - max number of results to be displayed per page
		    dataToPass: "", 		       // - data to be passed a long on each request for each page
		    scrollSpeed: "", 		       // - 'fast','slow','normal' 
		    scrollPx: "", 			       // - '40px' additional pixels to be scrolled 
		    reverse: "", 			       // - Adds results in the reverse direction
		    animate: "", 			       // - animates elements in 
		    loading: "", 			       // - 'indicatorImg','indicatorText'
			fillOnLoad: true, 		       // - fills up scroll element with results
			data: "", 				       // - pass data to be accessed within each function
			updateBrowserURL: "", 	       // - bool or function to update url Ex: #/page/2 or #/<whatever>/{{pageNumber}}/<whatever> 
			resultHolder: "", 		       // - selector of holder to contain results
			resultDataAtrr: "",		       // - turn off data attributes
			triggerfetchpercent: .8
		};

		this.metrics = { 
			scrollTarget : { 
				width    : 0,
				height   : 0,
				velocity : 0,  // px/ms,
				lastUpdated  : 0,  // ms
				offset : { 
					top    : 0,
					left   : 0 
				},
				scroll : { 
					top: 0,
					left: 0,
					height: 0,
					percentScrolledY: 0,
					percentScrolledX: 0
				}
			},
			resultsHolder : { 
				width    : 0,
				height   : 0,
				offset : { 
					top    : 0,
					left   : 0 
				}
			},
			network : {
				avgResponseTime: 0, 
				responseTimes: []
			}
		}; 
		
		this.timeouts = {
			updateScrollVelocity:0
		}; 

		this.getHandlers = function() { 
			
			return Helpers.extend( {}, handlers);
		}; 
 		
 		this.elements = Helpers.makeArray( elem ); 
		this.options  = Helpers.extend( defaults, options);
		this.events   = { 
			initialized: new Event('scrollin:initialized'),
			scrolling:   new Event('scrollin:scrolling'),
			complete:    new Event('scrollin:complete'),
			queueupdate: new Event('scrollin:queueupdate')
		}; 
		this.errors = { 
			
			onParseException: new Error('Invalid response format see documentation or override onParse().')
		};

		if ( typeof this.options['handlers'] === "object") { 
			for ( var index in this.options['handlers'] ) {
				if ( typeof handlers[index] === "object") { 
					if (handlers[index]['overridable']) 
					{
						handlers[index]['stack'] = [this.options['handlers'][index]];
					}
					else 
					{ 
						handlers[index]['stack'].push( this.options['handlers'][index] );
					}
				}
			}
		}
	
		this.setResultHolder().updateMetrics().bindHandlers();
		this.elements[0].dispatchEvent(this.events.initialized);
	});
	
	/* ------- Index --------*/ 
	Scrollin.i = function( scID ) { 
		if ( instances.length > 0 ) { 
			for(var index in instances) { 
				if (instances[index].options.scID === scID) { 
					return instances[index];
				}
			}
		}

		return null; 
	}; 
	
	/* ----- Callbacks ----- */
	Scrollin.callbacks = { 
		jsonp: null
	};

	Scrollin.prototype.at = function( property ) {
		switch ( property ) 
		{
			case 'start':
				return this.metrics.scrollTarget.scroll.top === 0;
				break;

			case 'triggerdistance':
				return this.options.triggerfetchpercent <= this.metrics.scrollTarget.scroll.percentScrolledY;
				break;
		}
	};

	Scrollin.prototype.handlersSet = function( handlerName ) { 
		
		var handler;
		var handlers = this.getHandlers();
		
		for(handler in handlers) { 
			if (handler === handlerName && handlers[handler]['stack'].length > 0) { 
				return handlers[handler]['stack'];
			}
		}

		return [];
	}; 

	Scrollin.prototype.dispatchHandler = function( handlerName, scInstance, data) {
	 	
	 	var handlers = scInstance.handlersSet(handlerName);
	 	var handler;
	 	var func;
	 	var response = []; 

	 	if (handlers.length > 0) 
	 	{
	 		for(handler in handlers) 
	 		{ 
	 			response.push( handlers[handler]( scInstance, data ) );
	 		}
	 	}
		
		return response;
	};

	/* ------ Options ------ */ 
	Scrollin.prototype.options = {}; 

	Scrollin.prototype.initOptions = function() { 
	};

	/* ------ Metric Logic------ */ 	
	Scrollin.prototype.metrics = {}; 
	
	Scrollin.prototype.timeouts = {}; 
	
	Scrollin.prototype.updateMetrics = function() { 
		this.updateScrollTargetMetrics();
		this.updateResultsHolderMetrics();
		return this;
	}; 
	
	Scrollin.prototype.updateScrollTargetMetrics = function() {
		if ( this.elements.length > 0 ) {
			this.metrics.scrollTarget.width       = Helpers.getElementWidth( this.elements[0] ); 
			this.metrics.scrollTarget.height      = Helpers.getElementHeight(  this.elements[0] );
			this.metrics.scrollTarget.offset.top  = this.elements[0].offsetTop;
			this.metrics.scrollTarget.offset.left = this.elements[0].offsetLeft;
			this.metrics.scrollTarget.scroll.height = this.elements[0].scrollHeight;
			this.metrics.scrollTarget.scroll.top = this.elements[0].scrollTop;
			this.metrics.scrollTarget.scroll.left = this.elements[0].scrollLeft;
			this.metrics.scrollTarget.scroll.percentScrolledY = (this.elements[0].scrollTop) / (this.elements[0].scrollHeight - this.metrics.scrollTarget.height); 
			this.metrics.scrollTarget.scroll.percentScrolledX = (this.elements[0].scrollLeft) / (this.elements[0].scrollWidth - this.metrics.scrollTarget.width); 
			this.metrics.scrollTarget.lastUpdated = (new Date()).getTime();
			
			
		}
		return this;
	}; 

	Scrollin.prototype.updateResultMetrics = function() { 
		if ( this.options['resultsHolder'] !== undefined ) { 
		}
		else { 
		}
		return this;	
	};

	Scrollin.prototype.updateResultsHolderMetrics = function() {
		if ( this.elements.length > 0 ) {
			this.metrics.resultsHolder.width       = Helpers.getElementWidth( this.elements[0] ); 
			this.metrics.resultsHolder.height      = Helpers.getElementHeight(  this.elements[0] );
			this.metrics.resultsHolder.offset.top  = this.elements[0].offsetTop;
			this.metrics.resultsHolder.offset.left = this.elements[0].offsetLeft;
		}
		return this;
	}; 

	Scrollin.prototype.updateFetchTriggerDistance = function() { 
	}; 
	
	Scrollin.prototype.updateScrollVelocity = function() { 
		var timeNow = (new Date()).getTime();
		this.metrics.scrollTarget.velocity = (this.elements[0].scrollTop - this.metrics.scrollTarget.scroll.top) / (timeNow - this.metrics.scrollTarget.lastUpdated);
		return this;
	}; 

	/* ------ Handler Logic------ */ 
	Scrollin.prototype.bindHandler = function(target, eventType, handler ) { 
		var scInstance = this;
		if(target !== undefined && target['addEventListener'] !== undefined && typeof handler === 'function') {
			target['addEventListener']( eventType, function(event) {
				handler( scInstance, event ); 
			});
		}
		return this; 
	}; 

	Scrollin.prototype.bindHandlers = function() { 
		var handler;
		var handlers = this.getHandlers();
		for(handler in handlers) {
			if ( handlers[handler] !== undefined ) { 
				if ( handlers[handler]['stack'].length > 0 ) { 
					for( index in handlers[handler]['stack'] ) { 
						this.bindHandler( this.elements[0], handlers[handler]['dispatchOn'], handlers[handler]['stack'][index] );
					}
				}
			}
		}
	}; 

	Scrollin.prototype.onScrolling = function( scInstance, event ) { 
		
		scInstance.updateScrollVelocity().updateMetrics();
		scInstance.elements[0].dispatchEvent(scInstance.events.scrolling);
		
		if (scInstance.at('triggerdistance')) 
		{
			scInstance.fetch();
		}
	}; 

	Scrollin.prototype.onInitialized = function( scInstance, event ) {
		
		if (scInstance.options.fillOnLoad)
		{
			scInstance.fill();
		}

		return scInstance; 
	}; 

	Scrollin.prototype.onParse = function( scInstance, response ) {
		
		var parsedResponse; 

		try 
		{
			parsedResponse = JSON.parse(response); 
			parsedResponse = parsedResponse['results'];
			
		}
		catch(responseParseException)
		{
			throw scInstance.errors.onParseException;
		}
		

		return parsedResponse;
	};

	Scrollin.prototype.onQueueUpdate = function( scInstance, parsedResponse ) { 
		
		if (parsedResponse instanceof Array)
		{
			scInstance.queue.push(parsedResponse);
			scInstance.elements[0].dispatchEvent(scInstance.events.queueupdate);
		}
		return scInstance;
	}; 

	/* ------- Queue Logic -------- */
	Scrollin.prototype.queue = []; 

	/* ------ Fetching Logic ------ */ 
	Scrollin.prototype.fill = function( callback ) { 
		var that = this; 
		if (this.metrics.scrollTarget.scroll.height <= this.metrics.scrollTarget.height) 
		{
			console.log('Keep filling this up!');
				
			this.fetch(function()
			{
				that.fill(); 
			});
		}
	}; 

	Scrollin.prototype.fetch = function( callback ) { 
		
		this.remoteFetch( callback );
	};

	Scrollin.prototype.remoteFetch = function( callback ) { 
		
		var that = this;
		var handlers; 

		Helpers.sendJSONP('http://dondrey.devo.purzue.com/rest/token/Test?action=results&callback=Scrollin.callbacks.jsonp&return_as=JSONP',function(response) 
		{
			that.dispatchHandler('onQueueUpdate', that, that.dispatchHandler('onParse', that, response) );
			that.updateResultHolder(); 
			if (typeof callback === 'function')
			{
				callback( that );
			}
		});
	}; 
	
	Scrollin.prototype.cacheFetch = function( response, pageNumber ) { 
	}; 

	/* ------ Results Logic ------ */
	Scrollin.prototype.updateResultHolder = function() {
		
		var index;
		var child;
		var children;

		if (this.at('triggerdistance') || this.at('start')) 
		{ 
			if (this.queue.length > 0) 
			{
				children = this.queue.pop();
				
				for(index in children) 
				{ 
					child = document.createElement('div');
					child.innerHTML = children[index];
					child = child.childNodes;
					this.options.resultHolder.appendChild( child[0] );
				}
			}
		} 

		this.updateMetrics(); 

		return this;
	}; 

	Scrollin.prototype.setResultHolder = function() { 
		if (this.options.resultHolder === "") { 
			this.options.resultHolder = this.elements[0];
		}
		return this;
	}; 

	Scrollin.prototype.applyTemplate = function() { 
	}; 	

	Scrollin.prototype.cacheResult = function( resultHTMLElement ) { 
	};

	Scrollin.prototype.addResultToDOM = function( resultHTMLElement ) { 
	};

	Scrollin.prototype.removeResultFromDOM = function( resultSelector ) { 
	}; 

	/* ------ Cache Logic ------ */ 
	Scrollin.prototype.cache = {}; 

	Scrollin.prototype.addToCache = function( key, value, local ) { 
	}; 

	Scrollin.prototype.removeFromCache = function( key, local ) { 
	};


	/* --- Attach to Widndow --- */ 
	window['Scrollin'] = Scrollin;	
	////////////////////////////////////


	///////////// JQUERY ///////////////
	if ( $ ) {
		$.fn.scrollin = function( options ) {
			instance = new Scrollin(this, options);
			instances.push(instance);
			return instance; 
		};
	}
	////////////////////////////////////


})( window );
