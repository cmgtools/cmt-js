/**
 * LatLongPicker allows us to set marker based on given longitude, latidude.
 * It also find the latitude/longitude for given address and set marker accordingly.
 */

( function( cmtjq ) {

	cmtjq.fn.latLongPicker = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.latLongPicker.defaults, options );
		var maps		= this;

		// Iterate and initialise all the page blocks
		maps.each( function() {

			var mapPicker	= cmtjq( this );

			init( mapPicker );
		});

		// return control
		return;

		// == Private Functions == //

		function init( mapPicker ) {

			// Initialise Google Map
			if( window.google ) {

				var gMap	= initMapPicker( mapPicker );
			}
		}

		function initMapPicker( mapPicker ) {

			var mapOptions 	= cmtjq.extend( true, {}, settings.mapOptions );
			var element 	= mapPicker.find( '.google-map' ).get( 0 );
			var latitude 	= mapPicker.find( '.latitude' );
			var longitude 	= mapPicker.find( '.longitude' );
			var zoom 		= mapPicker.find( '.zoom' );

			// Found fields
			if( latitude.length > 0 && longitude.length > 0 ) {

				latitude	= parseFloat( latitude.val() );
				longitude	= parseFloat( longitude.val() );
				zoom		= parseInt( zoom.val() );

				if( !cmtjq.isNumeric( latitude ) && !cmtjq.isNumeric( longitude ) ) {

					latitude	= settings.latitude;
					longitude	= settings.longitude;

					mapPicker.find( '.latitude' ).val( latitude );
					mapPicker.find( '.longitude' ).val( longitude );
				}

				// Update Zoom Level
				if( cmtjq.isNumeric( zoom ) ) {

					mapOptions.zoom = zoom;
				}
			}

			// Default map type
			if( null == mapOptions.mapTypeId ) {

				mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
			}

			mapOptions.center	= new google.maps.LatLng( latitude, longitude );
			var gMap 			= new google.maps.Map( element, mapOptions );
			var marker			= initMarker( mapPicker, gMap, mapOptions );

			// search locations using geocoder
			if( settings.geocoder ) {

				var geocoder 		= new google.maps.Geocoder();

				mapPicker.find( '.search-box' ).change( function() {

					var address	= cmtjq( this ).val();

					geocoder.geocode( { 'address': address }, function( results, status ) {

						if( status == google.maps.GeocoderStatus.OK ) {

							var location	= results[ 0 ].geometry.location;

							updateCenter( mapPicker, gMap, location, marker );
						}
					});
				});
			}

			// search locations using places for text
			if( settings.places ) {

				var placeService	= new google.maps.places.PlacesService( gMap );

				mapPicker.find( '.search-box' ).change( function() {

					var address	= cmtjq( this ).val();
					var request = { query: address };

					placeService.textSearch( request, function( results, status ) {

						if( status == google.maps.places.PlacesServiceStatus.OK ) {

							var location	= results[ 0 ].geometry.location;

							updateCenter( mapPicker, gMap, location, marker );
						}
					});
				});
			}

			mapPicker.find( '.search-ll' ).change( function() {

				var latLon		= cmtjq( this ).val();
				latLon			= latLon.split( ',' );
				var lat			= parseFloat( latLon[ 0 ] );
				var lon			= parseFloat( latLon[ 1 ] );
				var position 	= {lat: lat, lng: lon};

				updateCenter( mapPicker, gMap, position, marker );
			});

			return gMap;
		}

		function initMarker( mapPicker, gMap, mapOptions ) {

			var marker = new google.maps.Marker({
								position: mapOptions.center,
								map: gMap,
								title: settings.markerTitle,
								draggable: true
							});

			google.maps.event.addListener( marker, 'dragend', function( evt ) {

				updatePosition( mapPicker, gMap, marker.position );
			});

			google.maps.event.addListener( gMap, 'dblclick', function( evt ) {

				updatePositionWithMarker( mapPicker, gMap, evt.latLng, marker );
			});

			google.maps.event.addListener( gMap, 'click', function( evt ) {

				updatePositionWithMarker( mapPicker, gMap, evt.latLng, marker );
			});

			google.maps.event.addListener( gMap, 'zoom_changed', function() {

				resetZoom( mapPicker, gMap );
			});

			return marker;
		}

		function updatePosition( mapPicker, gMap, position ) {

			mapPicker.find( '.latitude' ).val( position.lat );
			mapPicker.find( '.longitude' ).val( position.lng );

			resetZoom( mapPicker, gMap );
		}

		function updatePositionWithMarker( mapPicker, gMap, position, marker ) {

			updatePosition( mapPicker, gMap, position );

			marker.setPosition( position );
		}

		function resetZoom( mapPicker, gMap ) {

			mapPicker.find( '.zoom' ).val( gMap.getZoom() );
		}

		function updateCenter( mapPicker, gMap, position, marker ) {

			updatePosition( mapPicker, gMap, position );

			gMap.setCenter( position );
			marker.setPosition( position );
		}
	};

	// Default Settings
	cmtjq.fn.latLongPicker.defaults = {
		map: null,
		latitude: 0,
		longitude: 0,
		markerTitle: 'My Location',
		geocoder: false,
		places: true,
		mapOptions : {
	    	zoom: 3,
	    	mapTypeId: null,
	    	mapTypeControl: false,
			zoomControlOptions: true,
			disableDoubleClickZoom: true
		}
	};

})( jQuery );