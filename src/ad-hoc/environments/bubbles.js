window.onload = function() {
	
	initialise();
};

/* ============= Globals =================================== */

var CANVAS_WIDTH		= 800;
var CANVAS_HEIGHT		= 400;
var BUBBLE_RADIUS_MIN	= 2;
var BUBBLE_RADIUS_MAX	= 10;
var BUBBLE_EXPLODE_MAX	= 30;
var BUBBLE_TWEEN_MIN	= 2;
var BUBBLE_TWEEN_MAX	= 4;
var FPS_CHECK			= 30 / 60;				
var MAX_DISPLACEMENT	= 600;

var BUBBLE_COLOR		= "#FFFF3D";
var BUBBLE_STROKE		= "#003DF5";

/* ============= Render Controller ========================= */

var bubbleManager	= null;
var animationTimer	= null;

function initialise() {

	bubbleManager	= new BubbleManager();
	
	bubbleManager.startAnimation();

	animationTimer	= setInterval ( "bubbleManager.render()", 30 );
}

/* ============= Animation Classes ========================= */

function BubbleManager() {
	
	this.stage 		= new Kinetic.Stage(
							{
						  		container: "canvas-container",
						  		width: CANVAS_WIDTH,
						  		height: CANVAS_HEIGHT
							}
						);
	this.layer		= new Kinetic.Layer();
	
	this.stage.add( this.layer );
	
	this.nozzle1	= new BubbleNozzle( this.layer, 100, 50 );
	this.nozzle2	= new BubbleNozzle( this.layer, 650, 50 );
	
	// Render Loop
	this.lastRender		= 0;
	this.timeElapsed	= 0;
}

BubbleManager.prototype.startAnimation = function() {
	
	// Initialise Bubbles
	this.nozzle1.initialise();
	this.nozzle2.initialise();
	
	this.lastRender	= new Date().getTime();
};

BubbleManager.prototype.render = function() {
	
	// Update Delta
	var currentRender	= new Date().getTime();
	var delta			= (currentRender - this.lastRender) / 1000;
	this.lastRender		= currentRender;

	// Update
	this.nozzle1.update( delta );
	this.nozzle2.update( delta );
	
	this.timeElapsed 	+= delta;
	
	if( this.timeElapsed > FPS_CHECK ) {	
		
		// Reset timer
		this.timeElapsed	= 0;

		// Draw
		this.layer.draw();
	}
};

function BubbleNozzle( layer, startX, startY ) {
	
	this.layer			= layer;
	this.startX			= startX;
	this.startY			= startY;
	
	this.maxCount		= 15;

	this.minX			= 20;
	this.minY			= 20;
	
	this.bubbles		= [];
}

BubbleNozzle.prototype.initialise = function() {

	// Add new bubbles
	for( i = 0; i < this.maxCount; i++ ) {
		
		var bubble	= new Bubble( this.layer, this.startX, this.startY );

		this.bubbles[i] = bubble;
	}
};

BubbleNozzle.prototype.update = function( delta ) {
	
	// Detect Boundary Collision and remove collided bubbles
	for( var i in this.bubbles ) {
		
		var bubble	= this.bubbles[ i ];

		if( null != bubble ) {

			bubble.update( delta );

			if( !bubble.isExploding() && this.detectBoundaryLimit( bubble ) ) {
				
				bubble.explode();
			}
			
			if( bubble.isExploded() ) {
				
				// dispose bubble
				bubble.dispose();

				var bubble	= new Bubble( this.layer, this.startX, this.startY );
		
				this.bubbles[i] = bubble;
			}
		}
	}
};

BubbleNozzle.prototype.detectBoundaryLimit = function( bubble ) {
	
	return bubble.getX() < 0 || bubble.getX() > CANVAS_WIDTH ||
		   bubble.getY() < 0 || bubble.getY() > CANVAS_HEIGHT;	
};

function Bubble( layer, startX, startY ) {
	
	this.layer			= layer;

	this.dx				= 0;
	this.dy				= 0;

	this.tweenDuration	= 0;
	this.tweenDurationElapsed	= 0;
	
	this.tween			= null;
	this.tweening		= false;

	this.radius			= Math.floor( (Math.random() * BUBBLE_RADIUS_MAX) + BUBBLE_RADIUS_MIN );
	this.exploding		= false;
	this.exCount		= 0;
	
	// Circle Shape
	this.circle			= new Kinetic.Circle(
							{
						        x: startX,
						        y: startY,
						        radius: Math.floor( ( Math.random() * BUBBLE_RADIUS_MAX ) + BUBBLE_RADIUS_MIN ),
						        //fill: BUBBLE_COLOR,
						        fillRadialGradientStartRadius: 0,
								fillRadialGradientEndRadius: 50,
								fillRadialGradientColorStops: [0,'yellow', 1, 'blue'],
						        stroke: BUBBLE_STROKE,
						        strokeWidth: 1
      						}
      					);
      					
	layer.add( this.circle );
}

Bubble.prototype.getX = function() {
	
	return this.circle.getX();
};

Bubble.prototype.getY = function() {
	
	return this.circle.getY();
};

Bubble.prototype.update = function( delta ) {
	
	if( this.exploding ) {
		
		this.exCount++;
	}
	else if( ! this.tweening ) {
		
		this.linearTween();
	}
	else if( this.tweening ) {

		this.tweenDurationElapsed += delta;

		if( this.tweenDurationElapsed > this.tweenDuration ) {
			
			this.tween.destroy();

			this.tweening	= false;
			this.tween		= null;
		}
	}
};

Bubble.prototype.linearTween = function() {
	
	this.dx						= Math.floor( Math.random() * MAX_DISPLACEMENT + 1) * 2 - MAX_DISPLACEMENT;
	this.dy						= Math.floor( Math.random() * MAX_DISPLACEMENT + 1) * 2 - MAX_DISPLACEMENT;

	this.tweenDuration			= Math.random() * BUBBLE_TWEEN_MAX + BUBBLE_TWEEN_MIN;
	this.tweenDurationElapsed	= 0;
	this.tweening				= true;

	this.tween = new Kinetic.Tween( {
      x: this.circle.getX() + this.dx,
      y: this.circle.getY() + this.dy,
	  node: this.circle,
	  rotationDeg: 360,
	  duration: this.tweenDuration,
	  easing: Kinetic.Easings.EaseInOut
	});
	
	this.tween.play();
};

Bubble.prototype.explode = function() {
	
	this.exploding		= true;
};

Bubble.prototype.isExploding = function() {

	return this.exploding;
};

Bubble.prototype.isExploded = function() {

	return this.exCount > BUBBLE_EXPLODE_MAX;
};

Bubble.prototype.dispose = function() {
	
	this.circle.destroy();
};

function log( message ) {
	
	if( null != console ) {
		
		console.log( message );
	}	
}