/**
 * Data utility provides methods to convert form elements to json format and to manipulate url parameters. The json data can be used to send request to server side apis.
 */

cmt.utils.data = {

	/**
	 * It reads elementId and convert the input fields present within the element to parameters url.
	 */
	serialiseElement: function( elementId, csrf ) {

		var dataArr		= [];
		var elements 	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof elementId == 'string' ) {

			elements 	= jQuery( '#' + elementId ).find( ':input' ).get();
		}
		else {

			elements	= elementId.find( ':input' ).get();
		}

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( encodeURIComponent( this.name ) + "=" + encodeURIComponent( val ) );
			}
		});

		// Form the data url having all the parameters
		var dataUrl = dataArr.join( "&" ).replace( /%20/g, "+" );

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam 	= jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl 	   += "&" + csrfParam + "=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads elementId and convert the input fields present within the element to json.
	 */
	elementToJson: function( elementId, csrf ) {

		var dataArr		= [];
		var elements 	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof elementId == 'string' ) {

			elements 	= jQuery( '#' + elementId ).find( ':input' ).get();
		}
		else {

			elements	= elementId.find( ':input' ).get();
		}

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( { name: this.name, value: val } );
			}
		});

		return cmt.utils.data.generateJsonMap( dataArr, csrf );
	},

	/**
	 * It reads formId and convert the input fields present within the form to parameters url. It use the serialize function provided by jQuery.
	 */
	serialiseForm: function( formId, csrf ) {

		// Generate form data for submission
		var dataUrl	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof formId == 'string' ) {

			dataUrl	= jQuery( '#' + formId ).serialize();
		}
		else {

			dataUrl	= formId.serialize();
		}

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam 	= jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl 	   += "&" + csrfParam + "=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads formId and convert the form input fields to a Json Array.
	 */
	formToJson: function( formId, csrf ) {

		// Generate form data for submission
		var formData	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof formId == 'string' ) {

			formData	= jQuery( '#' + formId ).serializeArray();
		}
		else {

			formData	= formId.serializeArray();
		}

		return cmt.utils.data.generateJsonMap( formData, csrf );
	},

	/**
	 * It reads an data array having name value pair and convert it to json format.
	 */
	generateJsonMap: function( dataArray, csrf ) {

		var json 		= {};

		// Append csrf token if required
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam   = jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataArray.push( { name: csrfParam, value: csrfToken } );
		}

		jQuery.map( dataArray, function(n, i) {

			var _ = n.name.indexOf('[');

			if (_ > -1) {

				var o = json;
				_name = n.name.replace(/\]/gi, '').split('[');

				for (var i=0, len=_name.length; i<len; i++) {

					if (i == len-1) {

						if (o[_name[i]]) {

							if (typeof o[_name[i]] == 'string') {

								o[_name[i]] = [o[_name[i]]];
							}

							o[_name[i]].push(n.value);
						}

						else o[_name[i]] = n.value || '';
					}

					else o = o[_name[i]] = o[_name[i]] || {};
				}
			}
			else {

				if (json[n.name] !== undefined) {

					if (!json[n.name].push) {

						json[n.name] = [json[n.name]];
					}

					json[n.name].push(n.value || '');
				}
				else {

					json[n.name] = n.value || '';
				}
			}
		});

		return json;
	},

	/**
	 * Return parameter value for given name and url.
	 */
	getParameterByName: function( param, url ) {

	    if( !url ) {

	    	url = window.location.href;
	    }

	    param 		= param.replace(/[\[\]]/g, "\\$&");

	    var regex 	= new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)");
		var results = regex.exec( url );

	    if( !results ) {

			return null;
	    }

	    if( !results[ 2 ] ) {

	    	return '';
	    }

	    return decodeURIComponent( results[ 2 ].replace( /\+/g, " " ) );
	},

	/**
	 * Add/Update parameter for the given URL.
	 */
	updateUrlParam: function( sourceUrl, e, t ) {

		var n;
		var r 	= "";
		var i 	= jQuery( "<a />" ).attr( "href", sourceUrl )[ 0 ];
		var s,o	= /\+/g;
		var u	= /([^&=]+)=?([^&]*)/g;
		var a	= function( e ) { return decodeURIComponent( e.replace( o, " " ) ); };
		var f 	= i.search.substring( 1 );
		n		= {};

		while( s = u.exec( f ) ) {

			n[ a( s[1] ) ] = a( s[2] );
		}

		if( !e && !t ) {

			return n;
		}
		else if( e && !t ) {

			return n[e];
		}
		else {

			n[e]	= t;
			var l	= [];

			for( var c in n ) {

				l.push( encodeURIComponent( c ) + "=" + encodeURIComponent( n[c] ) );
			}

			if( l.length > 0 ) {

				r = "?" + l.join( "&" );
			}

			return i.origin + i.pathname + r;
		}
	},

	/**
	 * Remove parameter from the given url.
	 */
	removeParam: function( sourceUrl, key ) {

	    var baseUrl 	= sourceUrl.split( "?" )[ 0 ];
		var param		= null;
		var paramsArr 	= [];
		var queryString = ( sourceUrl.indexOf( "?" ) !== -1 ) ? sourceUrl.split( "?" )[ 1 ] : "";

	    if( queryString !== "" ) {

	        paramsArr = queryString.split( "&" );

	        for( var i = paramsArr.length - 1; i >= 0; i -= 1 ) {

	            param = paramsArr[ i ].split( "=" )[ 0 ];

	            if( param === key ) {

	                paramsArr.splice( i, 1 );
	            }
	        }

	        baseUrl = baseUrl + "?" + paramsArr.join( "&" );
	    }

		if( baseUrl.slice( -1 ) == '?' ) {

			baseUrl	= baseUrl.slice( 0, -1 );
		}

	    return baseUrl;
	},

	/**
	 * Refresh current grid.
	 */
	refreshGrid: function() {

		var pageUrl	= window.location.href;

		pageUrl 	= cmt.utils.data.removeParam( pageUrl, 'page' );
		pageUrl 	= cmt.utils.data.removeParam( pageUrl, 'per-page' );

		window.location	= pageUrl;
	}
};