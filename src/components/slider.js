/**
 * A simple slider(simplified version of FoxSlider arranged in filmstrip fashion) to slide UI elements in circular fashion. We can use FoxSlider for more complex scenarios.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSlider = function( options ) {

		// == Init =================================================================== //

		// Configure Sliders
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSlider.defaults, options );
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

				slide.addClass( 'cmt-slider-slide' );
			});

			// wrap the slides
			var sliderHtml		= '<div class="cmt-slider-slides-wrap"><div class="cmt-slider-slides">' + slider.html() + '</div></div>';
			sliderHtml		   += '<div class="cmt-slider-control cmt-slider-control-left"></div><div class="cmt-slider-control cmt-slider-control-right"></div>';

			slider.html( sliderHtml );
		}

		// Make filmstrip of all slides
		function normaliseSlides( slider ) {

			// Calculate and set Slider Width
			//var sliderWidth		= slider.width();
			//var sliderHeight	= slider.height();
			var slidesWrapper	= slider.find( '.cmt-slider-slides' );
			var slidesSelector	= slider.find( '.cmt-slider-slide' );

			var slideWidth		= slidesSelector.outerWidth();
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

			if( slidesWrapper.width() < slider.width() ) {

				if( null !== settings.smallerContent ) {

					settings.smallerContent( slider, slidesWrapper );
				}
			}
		}

		// Initialise the Slider controls
		function initControls( slider ) {

			var slidesWrapper	= slider.find( '.cmt-slider-slides' );
			var leftControl		= slider.find( '.cmt-slider-control-left' );
			var rightControl	= slider.find( '.cmt-slider-control-right' );

			if( slidesWrapper.width() < slider.width() ) {

				leftControl.hide();
				rightControl.hide();

				return;
			}

			// Show Controls
			var lControlContent	= settings.lControlContent;
			var rControlContent	= settings.rControlContent;

			// Init Listeners
			leftControl.html( lControlContent );
			rightControl.html( rControlContent );

			if( !settings.circular ) {

				leftControl.hide();
				rightControl.show();
			}

			leftControl.click( function() {

				if( settings.circular ) {

					showPrevSlide( slider );
				}
				else {

					moveToRight( slider );
				}
			});

			rightControl.click( function() {

				if( settings.circular ) {

					showNextSlide( slider );
				}
				else {

					moveToLeft( slider );
				}
			});
		}

		function resetSlide( slider, slide ) {

			if( null !== settings.onSlideClick ) {

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

			var slidesSelector	= slider.find( '.cmt-slider-slide' );
			var slideWidth		= slidesSelector.width();
			var currentPosition	= 0;
			var filmstrip		= slider.find( '.cmt-slider-slides' );

			// reset filmstrip
			filmstrip.css( { left: 0 + 'px', 'right' : '' } );

			slidesSelector.each( function() {

				cmtjq( this ).css( { 'left': currentPosition + 'px', 'right' : '' } );

				currentPosition += slideWidth;
			});
		}

		// Show Previous Slide on clicking next button
		function showNextSlide( slider ) {

			var slidesSelector	= slider.find( '.cmt-slider-slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.width();
			var filmstrip		= slider.find( '.cmt-slider-slides' );

			// do pre processing
			if( null !== settings.preSlideChange ) {

				settings.preSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );
			}

			// do animation - animate slider
			filmstrip.animate(
				{ left: -slideWidth },
				{
					duration: 500,
					complete: function() {

						// Remove first and append to last
						var slidesSelector	= slider.find( '.cmt-slider-slide' );
						var firstSlide		= slidesSelector.first();
						firstSlide.insertAfter( slidesSelector.eq( slidesSelector.length - 1 ) );
						firstSlide.css( 'right', -slideWidth );

						resetSlides( slider );
					}
				}
			);

			firstSlide	= slidesSelector.first();

			// do post processing
			if( null !== settings.postSlideChange ) {

				settings.postSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );
			}
		}

		// Show Next Slide on clicking previous button
		function showPrevSlide( slider ) {

			var slidesSelector	= slider.find( '.cmt-slider-slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.width();
			var filmstrip		= slider.find( '.cmt-slider-slides' );

			// do pre processing
			if( null !== settings.preSlideChange ) {

				settings.preSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );
			}

			// Remove last and append to first
			var lastSlide		= slidesSelector.last();
			lastSlide.insertBefore( slidesSelector.eq(0) );
			lastSlide.css( 'left', -slideWidth );
			//var activeSlide		= lastSlide.attr( 'slide' );

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
			if( null !== settings.postSlideChange ) {

				settings.postSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );
			}
		}

		// Move to left on clicking next button
		function moveToLeft( slider ) {

			var leftControl		= slider.find( '.cmt-slider-control-left' );
			var rightControl	= slider.find( '.cmt-slider-control-right' );

			var slidesSelector	= slider.find( '.cmt-slider-slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.outerWidth();
			var filmstrip		= slider.find( '.cmt-slider-slides' );

			var sliderWidth		= slider.outerWidth();
			var filmWidth		= filmstrip.outerWidth();
			var filmLeft		= filmstrip.position().left;

			var moveBy			= slideWidth;
			var leftPosition	= filmLeft - moveBy;
			var remaining		= filmWidth + leftPosition;

			if( remaining > ( sliderWidth - moveBy ) ) {

				// do animation - animate slider
				filmstrip.animate(
					{ left: leftPosition },
					{
						duration: 500,
						complete: function() {

							var filmWidth		= filmstrip.outerWidth();
							var filmLeft		= filmstrip.position().left;

							var leftPosition	= filmLeft - moveBy;
							var remaining		= filmWidth + leftPosition;

							if( remaining < ( sliderWidth - moveBy ) ) {

								rightControl.hide();
							}

							if( leftControl.is( ':hidden' ) ) {

								leftControl.fadeIn( 'fast' );
							}
						}
					}
				);
			}
		}

		// Move to right on clicking prev button
		function moveToRight( slider ) {

			var leftControl		= slider.find( '.cmt-slider-control-left' );
			var rightControl	= slider.find( '.cmt-slider-control-right' );

			var slidesSelector	= slider.find( '.cmt-slider-slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.outerWidth();
			var filmstrip		= slider.find( '.cmt-slider-slides' );

			//var sliderWidth		= slider.outerWidth();
			//var filmWidth		= filmstrip.outerWidth();
			var filmLeft		= filmstrip.position().left;

			var moveBy			= slideWidth;
			var leftPosition	= filmLeft;

			if( leftPosition < -( slideWidth/2 ) ) {

				leftPosition = filmLeft + moveBy;

				// do animation - animate slider
				filmstrip.animate(
					{ left: leftPosition },
					{
						duration: 500,
						complete: function() {

							var filmLeft	= filmstrip.position().left;

							if( filmLeft > -( slideWidth/2 ) ) {

								leftControl.hide();
								filmstrip.position( { at: "left top" } );
							}

							if( rightControl.is( ':hidden' ) ) {

								rightControl.fadeIn( 'fast' );
							}
						}
					}
				);
			}
			else {

				leftControl.hide();
				filmstrip.position( { at: "left top" } );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlider.defaults = {
		// Controls
		lControlContent: null,
		rControlContent: null,
		// Callback - Content is less than slider
		smallerContent: null,
		// Listener Callback for slide click
		onSlideClick: null,
		// Listener Callback for pre processing
		preSlideChange: null,
		// Listener Callback for post processing
		postSlideChange: null,
		circular: true
	};

})( jQuery );
