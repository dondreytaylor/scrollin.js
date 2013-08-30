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
		functionExists: function( obj, functionName ) { 
		
			return (typeof obj === 'object') && (obj[functionName] !== undefined && typeof obj[functionName] === 'function');
		},
		functionsExist: function( obj, functionNames ) { 
			
			var functionName;
			var exists = 0; 

			if (obj !== undefined && typeof functionNames === 'object') { 
				for(functionName in functionNames)
				{
					if (obj[functionNames[functionName]] !== undefined && typeof obj[functionNames[functionName]] === 'function')
					{
						++exists;
					}	
				}

				return exists === functionNames.length;
			}

			return false;
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
					if (typeof object[index] === 'string' || typeof object[index] === 'number' || typeof object[index] === 'boolean')
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
						if (typeof object[index] === 'object' && object[index]) 
						{
							Helpers.urlifyObject( object[index], returningString );
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
		},
		joinArrays: function( array1, array2 ) { 
			
			var index; 

			if (this.isArray(array1) && this.isArray(array2)) 
			{
				for(index in array2) 
				{
					array1.push(array2[index]);
				}
			}

			return array1; 
		}
	};

	// Set Fallback implementations if necessary
	Helpers.setFallbacksOnNoSupport(); 
	
	/////////////////////////////////////

	///////// DEFINE SCROLLIN ///////////
	var Scrollin = (function( elem, options ) {
		
		var handlers; 
		var defaults;
		var state;
		var initializedEvent; 

		if ( !( this instanceof Scrollin ) ) { 
			instance = new Scrollin(elem, options);
			instances.push(instance);
			return instance;
		}

		if( typeof elem === 'string' ) { 
			
			elem = document.querySelectorAll( elem ); 
		}


		this.handlers = {
			onBeforeFetch:   { overridable: true,   stackEventCallbacks: [], stack: [],                   dispatchOn: '' },     
		    onFetch:         { overridable: true,   stackEventCallbacks: [], stack: [],                   dispatchOn: '' },                  
		    onFetchSuccess:  { overridable: true,   stackEventCallbacks: [], stack: [],                   dispatchOn: '' },    
		    onFetchFailure:  { overridable: true,   stackEventCallbacks: [], stack: [],                   dispatchOn: '' },   
		    onDestroy:       { overridable: false,  stackEventCallbacks: [], stack: [this.onDestroy],     dispatchOn: '' },                  
		    onParse:         { overridable: true,   stackEventCallbacks: [], stack: [this.onParse],       dispatchOn: '' },                  
		    onLastSet:       { overridable: false,  stackEventCallbacks: [], stack: [this.onLastSet],     dispatchOn: 'scrollin:lastset'},
		    onComplete:      { overridable: false,  stackEventCallbacks: [], stack: [this.onCompleted],   dispatchOn: 'scrollin:complete'},
		   
		    onPause:         { overridable: false,  stackEventCallbacks: [], stack: [],			          dispatchOn: 'scrollin:pause'},           
		    onResume:        { overridable: false,  stackEventCallbacks: [], stack: [],			          dispatchOn: 'scrollin:resume'},           
		    onStart:         { overridable: false,  stackEventCallbacks: [], stack: [this.onStart],		  dispatchOn: 'scrollin:start'},
		    onEnd:           { overridable: false,  stackEventCallbacks: [], stack: [this.onEnd],         dispatchOn: 'scrollin:end'},           
		    onScrolling:     { overridable: false,  stackEventCallbacks: [], stack: [this.onScrolling],   dispatchOn: 'scroll'},        
		    onQueueUpdate:   { overridable: false,  stackEventCallbacks: [], stack: [this.onQueueUpdate], dispatchOn: 'scrollin:queueupdate' },        
		    onInitialized:   { overridable: false,  stackEventCallbacks: [], stack: [this.onInitialized], dispatchOn: 'scrollin:initialized' },  
		    onStill:         { overridable: true,   stackEventCallbacks: [], stack: [],                   dispatchOn: '' },         	
		    onPageEnterView: { overridable: true,   stackEventCallbacks: [], stack: [],                   dispatchOn: '' },  
		    onPageLeaveView: { overridable: true,   stackEventCallbacks: [], stack: [],                   dispatchOn: '' }  
		};

		defaults  = {
			scID: (instances.length+1),    // - used as identifier
		    template: "", 			       // - markup for new elements
		    templateEngine: "", 	       // - engine used for markup
		    fetch: "", 				       // - url where we will be fetching 
		    debug: false, 				       // - used for development purposes
		    limit: false, 				   // - max number of results to be displayed per page
		    dataToPass: {}, 		       // - data to be passed a long on each request for each page
		    reverse: false, 			   // - Adds results in the reverse direction
		    loading: {
		    	indicatorImg:"",
		    	indicatorText:""
		    }, 			       			   // - 'indicatorImg','indicatorText'
			fillOnLoad: true, 		       // - fills up scroll element with results
			data: {}, 				       // - pass data to be accessed within each function
			url: true, 	       			   // - bool or function to update url Ex: #/page/2 or #/<whatever>/{{pageNumber}}/<whatever> 
			resultHolder: "", 		       // - selector of holder to contain results
			resultDataAtrr: "",		       // - turn off data attributes
			triggerfetchpercent: .98,
			axis:"y",
			apply: {},
			maxResultSet: false
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
			lastResult:  { 
				count : 0,
				height: 0
			},
			network : {
				avgResponseTime: 0, 
				responseTimes: []
			}
		}; 
		
		this.timeouts = {
			
			updateScrollVelocity:0
		}; 

 		this.elements = Helpers.makeArray( elem ); 
		
		this.options  = Helpers.extend( defaults, options);
		
		this.events   = { 
			initialize:  new Event('scrollin:initialized'),
			scroll:      new Event('scrollin:scroll'),
			complete:    new Event('scrollin:complete'),
			queueupdate: new Event('scrollin:queueupdate'),
			start:       new Event('scrollin:start'),
			end:         new Event('scrollin:end'),
			destroy:     new Event('scrollin:destroy'),
			pause:       new Event('scrollin:pause'),
			resume:      new Event('scrollin:resume'),
			lastset:     new Event('scrollin:lastset')
		}; 
		
		this.errors = { 
			
			onParseException: new Error('Invalid response format see documentation or override onParse().')
		};
		
		this.state = { 
			resultSet : 0,
			limit     : this.options.limit,
			scrolling : false,
			fetching  : false,
			start     : false,
			paused    : false,
			completed : false,
			lastset   : false
		}; 

		this.getHandlers = function() { 
			
			return Helpers.extend( {}, this.handlers);
		}; 
 		
 		this.getState = function() { 
 			
 			return Helpers.extend( {}, this.state);
		};
		
		if ( typeof this.options['handlers'] === "object") { 
			for ( var index in this.options['handlers'] ) {
				if ( typeof this.handlers[index] === "object") { 
					if (this.handlers[index]['overridable']) 
					{
						this.handlers[index]['stack'] = [this.options['handlers'][index]];
					}
					else 
					{ 
						this.handlers[index]['stack'].push( this.options['handlers'][index] );
					}
				}
			}
		}
	
		this.setResultHolder().updateMetrics().bindHandlers();
		this.elements[0].dispatchEvent(this.events.initialize);
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
				if (this.options.reverse === true) 
				{
					return Math.floor(this.metrics.scrollTarget.scroll.percentScrolledY * 100) === 100;
				}
				else 
				{
					return Math.ceil(this.metrics.scrollTarget.scroll.percentScrolledY * 100) === 0;
				}
				break;

			case 'end':
				if (this.options.reverse === true) 
				{
					return Math.ceil(this.metrics.scrollTarget.scroll.percentScrolledY * 100) <= 0;
				}
				else
				{
					return Math.floor(this.metrics.scrollTarget.scroll.percentScrolledY * 100) >= 100;
				}
				break;

			case 'complete':
				return this.at('end') && this.at('lastset'); 
				break;

			case 'lastset':
				return this.state.lastset;
				break;

			case 'triggerdistance':
				if(this.options.reverse === true)
				{
					return (1 - this.options.triggerfetchpercent) >= this.metrics.scrollTarget.scroll.percentScrolledY;
				}
				else 
				{
					return this.options.triggerfetchpercent <= this.metrics.scrollTarget.scroll.percentScrolledY;
				}
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

	Scrollin.prototype.dispatchHandler = function( handlerName, scInstance, argument ) {
	 	
	 	var handlers = scInstance.handlersSet(handlerName);
	 	var handler;
	 	var func;
	 	var response = []; 

	 	if (handlers.length > 0) 
	 	{
	 		for(handler in handlers) 
	 		{ 
	 			response.push( handlers[handler]( scInstance, argument, scInstance.options.data ) );
	 		}
	 	}
		
		return response;
	};

	Scrollin.prototype.checkAndTrigger = function() { 
		
		if (!this.is('completed') && !this.at('lastset') && this.at('triggerdistance')) 
		{
			if (!this.state['paused']) { 
				
				this.fetch();
			}
		}

		return this;
	}; 

	Scrollin.prototype.updateHash = function() { 
		
		var url; 

		// Use defined url
		if (typeof this.options.url === 'function')
		{
			url = this.options.url( this ); 

			if (typeof url === 'string')
			{
				window.location.hash = url; 
			}
		}

		// Default
		else  
		{
			window.location.hash = '/page/'+this.getState().resultSet;
		}

		return this; 
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
			this.metrics.scrollTarget.scroll.scrollY = (this.elements[0].scrollHeight - this.metrics.scrollTarget.height);
			this.metrics.scrollTarget.scroll.scrollX = (this.elements[0].scrollWidth - this.metrics.scrollTarget.width); 
			this.metrics.scrollTarget.scroll.percentScrolledY = (this.elements[0].scrollTop) / (this.elements[0].scrollHeight - this.metrics.scrollTarget.height); 
			this.metrics.scrollTarget.scroll.percentScrolledX = (this.elements[0].scrollLeft) / (this.elements[0].scrollWidth - this.metrics.scrollTarget.width); 
			this.metrics.scrollTarget.lastUpdated = (new Date()).getTime();
			
			
		}
		return this;
	}; 

	Scrollin.prototype.updateLastResultMetrics = function( results ) {
		
		//console.log( results[0] ); 
		//console.log( typeof results );
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
	Scrollin.prototype.bindHandler = function(target, eventType, handler, handlerName ) { 
		var scInstance = this;
		var eventCallback;

		if(target !== undefined && target['addEventListener'] !== undefined && typeof handler === 'function') {
			
			eventCallback = function(event) {
				handler( scInstance, event, scInstance.options.data ); 
			}; 

			this.handlers[handlerName]['stackEventCallbacks'].push( eventCallback );

			target['addEventListener']( eventType, eventCallback );
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
						this.bindHandler( this.elements[0], handlers[handler]['dispatchOn'], handlers[handler]['stack'][index], handler );
					}
				}
			}
		}
	}; 

	Scrollin.prototype.unbindHandler = function(target, eventType, handler ) { 
		var scInstance = this;
		if(target !== undefined && target['removeEventListener'] !== undefined && typeof handler === 'function') {
			target['removeEventListener']( eventType, handler ); 
		}
		return this; 
	}; 

	Scrollin.prototype.unbindHandlers = function() { 
		var handler;
		var handlers = this.getHandlers();
		for(handler in handlers) {
			if ( handlers[handler] !== undefined ) { 
				if ( handlers[handler]['stack'].length > 0 ) { 
					for( index in handlers[handler]['stack'] ) { 
						this.unbindHandler( this.elements[0], handlers[handler]['dispatchOn'], handlers[handler]['stackEventCallbacks'][index] );
					}
				}
			}
		}
	};  

	Scrollin.prototype.onScrolling = function( scInstance, event ) { 
		
		scInstance.updateScrollVelocity().updateMetrics();
		
		scInstance.elements[0].dispatchEvent(scInstance.events.scroll);
		
		if (scInstance.at('start'))
		{
			scInstance.elements[0].dispatchEvent(scInstance.events.start);
		}

		if (scInstance.at('end')) 
		{
			scInstance.elements[0].dispatchEvent(scInstance.events.end);
		}

		if (scInstance.at('complete'))
		{
			scInstance.elements[0].dispatchEvent(scInstance.events.complete);
		}

		if (!scInstance.is('fetching')) 
		{ 
			scInstance.checkAndTrigger();
		}
	}; 

	Scrollin.prototype.onLastSet = function( scInstance, event ) {
		
		scInstance.state.lastset = true;
	};
	
	Scrollin.prototype.onStart = function( scInstance, evnet ) { 
	}; 

	Scrollin.prototype.onEnd = function( scInstance, event ) { 
		if (!scInstance.is('queueempty'))
		{
			scInstance.updateResultHolder();
		}
	}; 

	Scrollin.prototype.onCompleted = function( scInstance, event ) { 
	}; 

	Scrollin.prototype.onInitialized = function( scInstance, event ) {
		
		if (scInstance.options.fillOnLoad)
		{
			scInstance.fill();
		}

		return scInstance; 
	}; 

	Scrollin.prototype.onParse = function( scInstance, response ) {
		
		var parsedResults; 

		try 
		{
			parsedResults = scInstance.applyTemplate( response['results'] );

			if (parsedResults.length === 0)
			{
				scInstance.state.completed = true;
			}
		}
		catch(responseParseException)
		{
			throw scInstance.errors.onParseException;
		}
		

		return parsedResults;
	};

	Scrollin.prototype.onQueueUpdate = function( scInstance, parsedResponse ) { 
		
		if (parsedResponse instanceof Array)
		{
			if (parsedResponse)
			{
				scInstance.cache.results.push(parsedResponse[0]); 

				scInstance.queue.push(parsedResponse[0]);
			}

			scInstance.elements[0].dispatchEvent(scInstance.events.queueupdate);
		}
		return scInstance;
	}; 

	Scrollin.prototype.onDestroy = function( scInstance ) { 
		if ( instances.length > 0 ) { 
			for(var index in instances) { 
				if (instances[index].options.scID === scInstance.options.scID) { 
					scInstance.unbindHandlers();
					delete instances[index];
					instances.splice(index,1);
				}
			}
		}
	}; 

	/* -------- Effects ----------- */
	Scrollin.prototype.apply = function( perform, data, index ) { 
		
		switch ( true ) { 
			
			case ('resultBefore' === perform) && (this.options.apply && typeof this.options.apply === 'object'  && typeof  this.options.apply.resultBefore === 'function'):
			case ('resultAfter' === perform) && (this.options.apply && typeof this.options.apply === 'object'  && typeof  this.options.apply.resultAfter === 'function'):
				this.options.apply[perform]( this, data, index);
				break;

			case ('resultsAfter' === perform) && (this.options.apply && typeof this.options.apply === 'object'  && typeof  this.options.apply.resultsAfter === 'function'):
			case ('resultsBefore' === perform) && (this.options.apply && typeof this.options.apply === 'object'  && typeof  this.options.apply.resultsBefore === 'function'):
				this.options.apply[perform]( this, data);
				break;
		}

		return this; 
	}; 

	/* ------- Queue Logic -------- */
	Scrollin.prototype.queue = []; 

	/* ------ Fetching Logic ------ */ 
	Scrollin.prototype.fill = function( callback ) { 
		var that = this; 
		if (this.metrics.scrollTarget.scroll.height <= this.metrics.scrollTarget.height) 
		{
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
		var urlWithData;
		var fetchHandler;
		var dataToPass = typeof this.options.dataToPass === 'function' ? this.options.dataToPass() : this.options.dataToPass; 
		
		dataToPass = Helpers.urlifyObject( Helpers.extend( dataToPass, this.getState() ) ); 
		
		// Set Remote
		this.options.fetch           = typeof this.options.fetch === 'object' ? this.options.fetch : {url:this.options.fetch};
		this.options.fetch.url       = typeof this.options.fetch.url === 'string' ? this.options.fetch.url : "";
		this.options.fetch.dataType  = typeof this.options.fetch.dataType === 'string' ? this.options.fetch.dataType : 'json';
		
		
		if (this.options.fetch.url.lastIndexOf('?') === -1)
		{
			dataToPass = '?' + dataToPass;
		}
		else if (this.options.fetch.url.lastIndexOf('&') === -1 || this.options.fetch.url.lastIndexOf('&') !== this.options.fetch.url.length ) 
		{
			dataToPass = '&' + dataToPass;
		}
		
		
		this.options.fetch.urlWithData = this.options.fetch.url + dataToPass;
		
		fetchHandler = function(response) 
		{
			that.dispatchHandler('onQueueUpdate', that, that.dispatchHandler('onParse', that, response) );
			that.updateResultHolder();

			// Delay setting indicator to prevent multiple requests
			setTimeout(function() { that.state['fetching'] = false; },1000); 

			if (typeof callback === 'function')
			{
				callback( that );
			}
		};

		switch(this.options.fetch.dataType.toLowerCase())
		{	
			// Same Domain
			case 'json':
				break;

			// Cross Domain
			default:
				
				

				if (!this.is('queueempty'))
				{
					that.updateResultHolder();
				}
				else 
				{	
					this.state['fetching'] = true; 
					Helpers.sendJSONP(this.options.fetch.urlWithData,fetchHandler);
				}
				break;
		}
	}; 
	
	Scrollin.prototype.cacheFetch = function( response, pageNumber ) { 
	}; 

	/* ------ Results Logic ------ */
	Scrollin.prototype.updateResultHolder = function() {
		
		var that = this; 
		var index;
		var images;
		var child;
		var children;
		var totalHeight = 0;
		var childrenElms = [];
		var firstInQueue; 
		var startIndex;
		var endIndex; 

		if (this.at('triggerdistance') || this.at('start')) 
		{ 
			if (this.queue.length > 0) 
			{
				
				firstInQueue = this.queue[0]; 

				startIndex = 0;
				
				endIndex = typeof this.options.limit === 'object' && this.options.limit.count !== undefined ? this.options.limit.count : firstInQueue.length;

				children = firstInQueue.splice(0, endIndex); 

				if (firstInQueue.length === 0) 
				{ 

					++this.state.resultSet;
					
					firstInQueue = this.queue.splice(0,1);

					children = Helpers.joinArrays( children, firstInQueue.splice(0, endIndex - children.length) );
				}
				
				if (children !== undefined && children.length > 0) 
				{

					for(index in children) 
					{ 
						
						child = document.createElement('div');
						child.innerHTML = children[index];
						child = child.childNodes;
						
						if (child[0] !== undefined)
						{
							childrenElms.push(child[0]);
						}
					}
					
					this.updateLastResultMetrics( childrenElms ); 
					
					this.apply('resultsBefore', childrenElms ); 

					for (index in childrenElms) 
					{
						this.apply('resultBefore', childrenElms[index], index );

						if (this.options.reverse === true) 
						{
							this.options.resultHolder.insertBefore( childrenElms[index], this.options.resultHolder.firstChild );
						}
						else
						{
							this.options.resultHolder.appendChild( childrenElms[index] );
						}

						images = childrenElms[index].getElementsByTagName('img'); 
						

						// Calculate image dimensions
						(function(resultSet) 
						{ 
							var imgCount = 0; 
							var img; 
							

							for(img in images) 
							{
								
								if (!isNaN(parseInt(img))) 
								{
									images[img].onload = function() 
									{
										++imgCount;

										totalHeight += (
											parseInt(window.getComputedStyle( childrenElms[index], null).getPropertyValue('height')) + 
											parseInt(window.getComputedStyle( childrenElms[index], null).getPropertyValue('margin-top')) + 
											parseInt(window.getComputedStyle( childrenElms[index], null).getPropertyValue('margin-bottom'))
										);
										

										if (imgCount === images.length) 
										{ 
											that.updateMetrics();

											if (that.options.reverse === true) 
											{
												that.elements[0].scrollTop = totalHeight;
											}
										}

									};
								};
							}

						})(this.state.resultSet);


						this.apply('resultAfter', this.options.resultHolder.lastChild, index );
					}

					this.apply('resultsAfter', childrenElms );

					this.updateMetrics();
				}
			}
		} 

		

		if (this.options.maxResultSet === this.state.resultSet)
		{
			this.elements[0].dispatchEvent(this.events.lastset);

		}
		console.log(this.queue);
		return this;
	}; 

	Scrollin.prototype.setResultHolder = function() { 
		if (this.options.resultHolder === "") { 
			this.options.resultHolder = this.elements[0];
		}
		return this;
	}; 

	Scrollin.prototype.applyTemplate = function( results ) { 
		
		var result;
		var compiled;
		var parsedResults = []; 
		var templateEngine; 

		if (typeof this.options.template === 'function') 
		{ 
			for(result in results)
			{
				parsedResults.push( this.options.template( this, results[result] ) );
			
				// Apply Template using Template Engine if user supplied one
				if (this.options.templateEngine)
				{
					templateEngine = this.options.templateEngine;
					
					switch(true) 
					{
						
						// Dust	
						case (dust !== undefined && typeof dust === 'object') && (Helpers.functionsExist(templateEngine,['compile','loadSource','render'])):    
							compiled = templateEngine.compile(parsedResults[result],'scrollinresult');
							templateEngine.loadSource(compiled);
							templateEngine.render("scrollinresult", results[result], function( err, out)
							{
								parsedResults[result] = out;
							});
							break;

						// Mustache Compliant templates
						default:
							break;
					} 
				}
			}
		}

		return parsedResults;
	}; 	

	/* ------ Cache Logic ------ */ 
	Scrollin.prototype.cache = {results:[]}; 

	Scrollin.prototype.addToLocalStorage = function( key, value, local ) { 
	}; 

	Scrollin.prototype.removeFromLocalStorage = function( key, local ) { 
	};

	/* ------ API Methods ------*/
	Scrollin.prototype.is = function( state ) {
		
		switch (state)
		{
			case 'queueempty':
				return (this.queue.length === 0 || this.queue[this.queue.length-1].length === 0);
				break;

			case 'fetching':
				return this.state.fetching;
				break;

			case 'scrolling':
				return this.state.scrolling;
				break;

			case 'completed':
				return this.state.completed;
				break;

			case 'paused':
				return this.state.paused;
				break;

			case 'still':
				return !this.state.scrolling;
				break;

			case 'onOutOfBoundPage':
				break;

		}
	};

	Scrollin.prototype.get = function( prop ) { 
		
		return this.options[prop]; 
	}; 

	Scrollin.prototype.set = function( prop, value ) {
		
		this.options[prop] = value; 
		return this;
	}; 

	Scrollin.prototype.pause = function() { 
		this.state['paused'] = true;
		this.elements[0].dispatchEvent(this.events.pause);
		return this; 
	}; 

	Scrollin.prototype.resume = function() { 
		this.state['paused'] = false;
		this.elements[0].dispatchEvent(this.events.resume); 
		this.checkAndTrigger();
		return this; 
	}; 

	Scrollin.prototype.destroy = function() { 
		this.dispatchHandler('onDestroy', this);
		this.elements[0].dispatchEvent(this.events.destroy);
	}; 


	/* --- Attach to Window --- */ 
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
