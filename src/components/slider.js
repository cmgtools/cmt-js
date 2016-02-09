/**
 * A simple slider(simplified version of FoxSlider arranged in filmstrip fashion) to slide UI elements in circular fashion. We can use FoxSlider for more complex scenarios.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSlider = function( options ) {

		// == Init =================================================================== //

		// Configure Sliders
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSlider, options );
		var sliders			= this;

		// Iterate and initialise all the fox sliders
		sliders.each( function() {

			var slider	= cmtjq( this );

			init( slider );
		});

		// Windows resize
		cmtjq( window ).resize(function() {

			// Iterate and resize all the fox sliders
			sliders.each( function() {

				var slider	= cmtjq( this );

				normaliseSlides( slider );
			});
		});

		// return control
		return;

		// == Private Functions ===================================================== //

		// == Bootstrap ==================================== //

		// Initialise Slider
		function init( slider ) {

			// Update Slider html
			initSliderHtml( slider );

			// Set Slider and Slides based on configuration params
			normaliseSlides( slider );

			// Initialise controls
			initControls( slider );
		}

		// Update Slider html
		function initSliderHtml( slider ) {

			// Add slide class to all the slides
			slider.children().each( function() {

				var slide = cmtjq( this );

				slide.addClass( 'slide' );
			});

			// wrap the slides
			var sliderHtml		= '<div class="slides-wrap">' + slider.html() + '</div>';
			sliderHtml		   += '<div class="control control-left"></div><div class="control control-right"></div>';

			slider.html( sliderHtml );
		}

		// Make filmstrip of all slides
		function normaliseSlides( slider ) {

			// Calculate and set Slider Width
			var sliderWidth		= slider.width();
			var sliderHeight	= slider.height();
			var slidesWrapper	= slider.find( '.slides-wrap' );
			var slidesSelector	= slider.find( '.slide' );

			var slideWidth		= slidesSelector.width();
			var slidesCount		= slidesSelector.length;

			// Initialise Slide position
			var currentPosition	= 0;

			slidesWrapper.width( slideWidth * slidesCount );

			// Set slides position on filmstrip
			slidesSelector.each( function( count ) {

				var currentSlide	= cmtjq( this );

				currentSlide.css( 'left', currentPosition );

				currentSlide.attr( 'slide', count );

				currentPosition += slideWidth;

				resetSlide( slider, currentSlide );
			});
		}

		// Initialise the Slider controls
		function initControls( slider ) {

			// Show Controls
			var controls 		= slider.find( '.controls' );
			var lControlContent	= settings.lControlContent;
			var rControlContent	= settings.rControlContent;

			// Init Listeners				
			var leftControl		= slider.find( '.control-left' );
			var rightControl	= slider.find( '.control-right' );

			leftControl.html( lControlContent );
			rightControl.html( rControlContent );

			leftControl.click( function() {

				showPrevSlide( cmtjq( this ).closest( '.cmt-slider' ) );
			});

			rightControl.click( function() {

				showNextSlide( cmtjq( this ).closest( '.cmt-slider' ) );
			});
		}

		function resetSlide( slider, slide ) {

			if( null != settings.onSlideClick ) {

				// remove existing click event
				slide.unbind( 'click' );

				// reset click event
				slide.click( function() {

					settings.onSlideClick( slider, slide, slide.attr( 'slide' ) );
				});
			}
		}

		// == Slides Movements ============================= //

		// Calculate and re-position slides to form filmstrip
		function resetSlides( slider ) {

			var slidesSelector	= slider.find( '.slide' );
			var slideWidth		= slidesSelector.width();
			var currentPosition	= 0;
			var filmstrip		= slider.find( '.slides-wrap' );

			// reset filmstrip
			filmstrip.css( { left: 0 + 'px', 'right' : '' } );

			slidesSelector.each( function() {

				cmtjq( this ).css( { 'left': currentPosition + 'px', 'right' : '' } );
				cmtjq( this ).removeClass( 'active' );

				currentPosition += slideWidth;
			});
		}

		// Show Previous Slide on clicking next button
		function showNextSlide( slider ) {

			var slidesSelector	= slider.find( '.slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.width();
			var filmstrip		= slider.find( '.slides-wrap' );

			// do pre processing
			if( null != settings.preSlideChange ) {

				settings.preSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );				
			}

			// do animation - animate slider
			filmstrip.animate(
				{ left: -slideWidth },
				{
					duration: 500,
					complete: function() {

						var slider = cmtjq( this ).parent();

						// Remove first and append to last
						var slidesSelector	= slider.find( '.slide' );
						var firstSlide		= slidesSelector.first();
						firstSlide.insertAfter( slidesSelector.eq( slidesSelector.length - 1 ) );
						firstSlide.css( 'right', -slideWidth );

						resetSlides( slider );
						//resetSlide( slider, firstSlide );
					}
				}
			);

			firstSlide	= slidesSelector.first();

			// do post processing
			if( null != settings.postSlideChange ) {

				settings.postSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );				
			}
		}

		// Show Next Slide on clicking previous button
		function showPrevSlide( slider ) {

			var slidesSelector	= slider.find( '.slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.width();
			var filmstrip		= slider.find( '.slides-wrap' );

			// do pre processing
			if( null != settings.preSlideChange ) {

				settings.preSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );
			}

			// Remove last and append to first
			var lastSlide		= slidesSelector.last();
			lastSlide.insertBefore( slidesSelector.eq(0) );
			lastSlide.css( 'left', -slideWidth );
			var activeSlide		= lastSlide.attr( 'slide' );

			// do animation - animate slider
			filmstrip.animate(
				{ left: slideWidth },
				{
					duration: 500,
					complete: function() {

						var slider = cmtjq( this ).parent();

						resetSlides( slider );
					}
				}
			);

			firstSlide	= slidesSelector.first();

			// do post processing
			if( null != settings.postSlideChange ) {

				settings.postSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );				
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlider.defaults = {
		// Controls
		lControlContent: null,
		rControlContent: null,
		// Listener Callback for slide click
		onSlideClick: null,
		// Listener Callback for pre processing
		preSlideChange: null,
		// Listener Callback for post processing
		postSlideChange: null
	};

})( jQuery );