/**
 * Time Picker plugin can be used to choose time.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtTimePicker = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtTimePicker.defaults, options );
		var pickers		= this;

		// Append singleton element at the end of body
		jQuery( 'body' ).append( '<div id="' + settings.id + '" class="cmt-timepicker ' + settings.classes + '" style="z-index: 100;"></div>' );

		// Iterate and initialise all the picker elements
		pickers.each( function() {

			var picker = cmtjq( this );

			init( picker );
		});

		// return control
		return;

		// == Private Functions == //

		function init( picker ) {

			// Picker singleton
			var timePicker = cmtjq( '#' + settings.id );

			// Turn off autocomplete
			picker.attr( 'autocomplete', 'off' );
			picker.attr( 'readonly', true );

			picker.focusin( function() {

				destroyPickerElement( timePicker );

				initPickerElement( timePicker, picker );
			});
		}

		function initPickerElement( timePicker, picker ) {

			// Header
			var header = '<div class="cmt-timepicker-header row">\n\
								<div class="colf colf2 row">\n\
									<div class="cmt-timepicker-apm cmt-timepicker-am colf colf2 align align-center active">AM</div>\n\
									<div class="cmt-timepicker-apm cmt-timepicker-pm colf colf2 align align-center">PM</div>\n\
								</div>\n\
								<div class="cmt-timepicker-apm cmt-timepicker-mm colf colf2 align align-center">Minutes</div>\n\
							</div>';

			// TODO: Initialise content programatically instead of hardcoding hours and minutes

			// Content
			var content = '<div class="cmt-timepicker-content row">\n\
								<div class="cmt-timepicker-hr-wrap colf colf2 row">\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-1 active">1</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-2">2</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-3">3</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-4">4</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-5">5</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-6">6</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-7">7</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-8">8</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-9">9</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-10">10</div>\n\
									<div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-11">11</div><div class="colf colf3 cmt-timepicker-hr cmt-timepicker-hr-12">12</div>\n\
								</div>\n\
								<div class="cmt-timepicker-min-wrap colf colf2 row">\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-0 active">0</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-5">5</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-10">10</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-15">15</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-20">20</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-25">25</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-30">30</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-35">35</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-40">40</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-45">45</div>\n\
									<div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-50">50</div><div class="colf colf3 cmt-timepicker-min cmt-timepicker-min-55">55</div>\n\
								</div>\n\
							</div>';

			// Footer
			var footer = '<div class="cmt-timepicker-footer row">\n\
								<div class="colf colf2 row">\n\
									<input class="cmt-timepicker-time" type="text" readonly />\n\
								</div>\n\
								<div class="colf colf2">\n\
									<span class="cmt-timepicker-ok btn-icon"><i class="cmti cmti-approve"></i></span>\n\
									<span class="cmt-timepicker-close btn-icon"><i class="cmti cmti-close"></i></span>\n\
								</div>\n\
							</div>';

			// Append elements
			timePicker.append( header );
			timePicker.append( content );
			timePicker.append( footer );

			// Dimensions
			var position	= picker.offset();
			var top			= position.top + picker.outerHeight();
			var left		= position.left;

			timePicker.css( { 'top': top + 'px', 'left': left + 'px' } );
			timePicker.css( { 'width': settings.width, 'height': settings.height } );

			// Initial Value
			var time	= picker.val();

			if( time.length > 0 ) {

				var split1 = time.split( ' ' );
				var split2 = split1[ 0 ].split( ':' );

				timePicker.find( '.cmt-timepicker-hr' ).removeClass( 'active' );
				timePicker.find( '.cmt-timepicker-hr-' + split2[ 0 ] ).addClass( 'active' );

				timePicker.find( '.cmt-timepicker-min' ).removeClass( 'active' );
				timePicker.find( '.cmt-timepicker-min-' + split2[ 1 ] ).addClass( 'active' );

				timePicker.find( '.cmt-timepicker-apm' ).removeClass( 'active' );

				if( split1[ 1 ] === 'AM' ) {

					timePicker.find( '.cmt-timepicker-am' ).addClass( 'active' );
				}
				else {

					timePicker.find( '.cmt-timepicker-pm' ).addClass( 'active' );
				}
			}

			setTime( timePicker );

			// On AM/PM
			timePicker.find( '.cmt-timepicker-am, .cmt-timepicker-pm' ).click( function() {

				timePicker.find( '.cmt-timepicker-apm' ).removeClass( 'active' );
				cmtjq( this ).addClass( 'active' );

				setTime( timePicker );
			});

			// On Hour
			timePicker.find( '.cmt-timepicker-hr' ).click( function() {

				timePicker.find( '.cmt-timepicker-hr' ).removeClass( 'active' );
				cmtjq( this ).addClass( 'active' );

				setTime( timePicker );
			});

			// On Min
			timePicker.find( '.cmt-timepicker-min' ).click( function() {

				timePicker.find( '.cmt-timepicker-min' ).removeClass( 'active' );
				cmtjq( this ).addClass( 'active' );

				setTime( timePicker );
			});

			// On Ok
			timePicker.find( '.cmt-timepicker-ok' ).click( function() {

				picker.val( timePicker.find( '.cmt-timepicker-time' ).val() );

				picker.trigger( 'change' );

				destroyPickerElement( timePicker );
			});

			// On Close
			timePicker.find( '.cmt-timepicker-close' ).click( function() {

				destroyPickerElement( timePicker );
			});

			// Show
			timePicker.fadeIn( 'slow' );
		}

		function destroyPickerElement( timePicker ) {

			timePicker.fadeOut( 'fast' );

			timePicker.html( '' );
		}

		function setTime( timePicker ) {

			// Value
			var hr		= timePicker.find( '.cmt-timepicker-hr.active' ).html();
			var min		= timePicker.find( '.cmt-timepicker-min.active' ).html();
			var apm		= timePicker.find( '.cmt-timepicker-apm.active' ).html();
			var timeStr	= hr + ":" + min + " " + apm;

			// Set time
			timePicker.find( '.cmt-timepicker-time' ).val( timeStr );
		}
	};

	// Default Settings
	cmtjq.fn.cmtTimePicker.defaults = {
		id: 'cmt-el-timepicker', // singleton timepicker element
		classes: 'cmt-timepicker-basic', // additional classes
		width: 220,
		height: 220
	};

})( jQuery );
