// Copyright 2016-2017, University of Colorado Boulder

/**
 * View for the tracer, which can be dragged to change location.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  // strings
  var pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  var timeString = require( 'string!PROJECTILE_MOTION/time' );
  var sString = require( 'string!PROJECTILE_MOTION/s' );
  var rangeString = require( 'string!PROJECTILE_MOTION/range' );
  var heightString = require( 'string!PROJECTILE_MOTION/height' );
  var mString = require( 'string!PROJECTILE_MOTION/m' );

  // constants
  var CIRCLE_AROUND_CROSSHAIR_RADIUS = 15; // view units, will not be transformed
  var OPAQUE_BLUE = 'rgb( 41, 66, 150 )';
  var TRANSPARENT_WHITE = 'rgba( 255, 255, 255, 0.2 )';
  var HALO_COLOR = 'rgba( 255, 255, 0, 0.8 )';
  var HALO_EDGE_COLOR = 'rgba( 255, 255, 0, 0 )';
  var DOT_RADIUS = ProjectileMotionConstants.DOT_RADIUS;
  var SPACING = 4;
  var LABEL_OPTIONS = _.defaults( { fill: 'white' }, ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
 
  var TRACER_CONTENT_WIDTH = 155;
  var RIGHTSIDE_PADDING = 6;

  /**
   * @param {Score} tracer - model of the tracer tool
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {Object} [options]
   * @param {ScreenView} screenView
   * @constructor
   */
  function TracerNode( tracer, transformProperty, screenView, options ) {
    var self = this;
    
    // @public is this being handled by user?
    this.isUserControlledProperty = new BooleanProperty( false );
    
    // @private
    this.spacing = SPACING; // {number} x and y spacing and margins
    this.tracer = tracer; // model
    this.probeOrigin = Vector2.createFromPool( 0, 0 ); // where the crosshairs cross

    // draggable node
    var rectangle = new Rectangle(
      0,
      0,
      TRACER_CONTENT_WIDTH + RIGHTSIDE_PADDING,
      95, {
        cornerRadius: 8,
        fill: OPAQUE_BLUE,
        stroke: 'gray',
        lineWidth: 4,
        opacity: 0.8,
        pickable: true,
        cursor: 'pointer'
      }
    );

    // @private
    this.rectangle = rectangle;

    rectangle.setMouseArea( rectangle.bounds.dilatedXY( 10, 2 ) );
    rectangle.setTouchArea( rectangle.bounds.dilatedXY( 15, 6 ) );

    // shift the tracer drag bounds so that it can only be dragged until the center reaches the left or right side
    // of the screen
    var dragBoundsShift = -TRACER_CONTENT_WIDTH / 2 + RIGHTSIDE_PADDING;

    // @public Should be added as a listener by our parent when the time is right
    this.movableDragHandler = new MovableDragHandler( tracer.positionProperty, {
      modelViewTransform: transformProperty.get(),
      dragBounds: screenView.visibleBoundsProperty.get().shiftedX( dragBoundsShift ),
      startDrag: function( event ) {
        self.isUserControlledProperty.set( true );
      },
      endDrag: function( event ) {
        self.isUserControlledProperty.set( false );
      }
    } );

    // When dragging, move the tracer tool
    rectangle.addInputListener( this.movableDragHandler );

    // crosshair view
    var crosshairShape = new Shape()
      .moveTo( -CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
      .lineTo( CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
      .moveTo( 0, -CIRCLE_AROUND_CROSSHAIR_RADIUS )
      .lineTo( 0, CIRCLE_AROUND_CROSSHAIR_RADIUS );

    var crosshair = new Path( crosshairShape, { stroke: 'black' } );
    var circle = new Circle( CIRCLE_AROUND_CROSSHAIR_RADIUS, { lineWidth: 2, stroke: 'black', fill: TRANSPARENT_WHITE } );

    // Create the base of the crosshair
    var crosshairMount = new Rectangle( 0, 0, 0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS, 0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS, { fill: 'gray' } );
    
    // label and values readouts
    var timeReadoutProperty = new Property( '-' );
    var rangeReadoutProperty = new Property( '-' );
    var heightReadoutProperty = new Property( '-' );

    var timeBox = this.createInformationBox( TRACER_CONTENT_WIDTH, timeString, timeReadoutProperty );
    var rangeBox = this.createInformationBox( TRACER_CONTENT_WIDTH, rangeString, rangeReadoutProperty );
    var heightBox = this.createInformationBox( TRACER_CONTENT_WIDTH, heightString, heightReadoutProperty );

    var textBox = new VBox( {
      align: 'left',
      spacing: SPACING,
      children: [
        timeBox,
        rangeBox,
        heightBox
      ]
    } );
    
    // halo node for highlighting the dataPoint whose information is shown in the tracer tool
    var haloNode = new Circle( DOT_RADIUS * 2, {
      fill: new RadialGradient( 0, 0, 0, 0, 0, DOT_RADIUS * 4 )
        .addColorStop( 0, 'black' )
        .addColorStop( 0.25, 'black' )
        .addColorStop( 0.25, HALO_COLOR )
        .addColorStop( 1, HALO_EDGE_COLOR ),
    } );

    // Listen for when time, range, and height change, and update the readouts.
    tracer.dataPointProperty.link( function( point ) {
      if ( point !== null ) {
        timeReadoutProperty.set( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: Util.toFixedNumber( point.time, 2 ),
          units: sString
        } ) );
        rangeReadoutProperty.set( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: Util.toFixedNumber( point.position.x, 2 ),
          units: mString
        } ) );
        heightReadoutProperty.set( StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
          value: Util.toFixedNumber( point.position.y, 2 ),
          units: mString
        } ) );
        haloNode.centerX = transformProperty.get().modelToViewX( point.position.x );
        haloNode.centerY = transformProperty.get().modelToViewY( point.position.y );
        haloNode.visible = true;
      }
      else {
        timeReadoutProperty.set( '-' );
        rangeReadoutProperty.set( '-' );
        heightReadoutProperty.set( '-' );
        haloNode.visible = false;
      }
    } );

    // function align locations, and update model.
    var updatePosition = function( position ) {
      self.probeOrigin.set( transformProperty.get().modelToViewPosition( position ) );

      crosshair.center = self.probeOrigin;
      circle.center = self.probeOrigin;
      crosshairMount.left = self.probeOrigin.x + CIRCLE_AROUND_CROSSHAIR_RADIUS;
      crosshairMount.centerY = self.probeOrigin.y;
      rectangle.left = crosshairMount.right;
      rectangle.centerY = self.probeOrigin.y;
      textBox.left = rectangle.left + 2 * SPACING;
      textBox.top = rectangle.top + 2 * SPACING;

      if ( tracer.dataPointProperty.get() ) {
        haloNode.centerX = transformProperty.get().modelToViewX( tracer.dataPointProperty.get().position.x );
        haloNode.centerY = transformProperty.get().modelToViewY( tracer.dataPointProperty.get().position.y );
      }
    };

    // Observe changes in the modelViewTransform and update/adjust positions accordingly
    transformProperty.link( function( transform ) {
      self.movableDragHandler.setModelViewTransform( transform );
      self.movableDragHandler.setDragBounds( transform.viewToModelBounds( screenView.visibleBoundsProperty.get().shiftedX( dragBoundsShift ) ) );
      updatePosition( tracer.positionProperty.get() );
    } );

    // Observe changes in the visible bounds and update drag bounds and adjust positions accordingly
    screenView.visibleBoundsProperty.link( function( bounds ) {
      self.movableDragHandler.setDragBounds( transformProperty.get().viewToModelBounds( screenView.visibleBoundsProperty.get().shiftedX( dragBoundsShift ) ) );
      updatePosition( tracer.positionProperty.get() );
    } );

    // Listen for location changes, align locations, and update model.
    tracer.positionProperty.link( function( position ) {
      updatePosition( position );
      self.tracer.updateData();
    } );

    options = options || {};
    assert && assert( !options.children, 'this type sets is own children' );

    // Rendering order
    options.children = [
      haloNode,
      crosshairMount,
      rectangle,
      circle,
      crosshair,
      textBox
    ];

    Node.call( this, options );

    // visibility of the tracer
    tracer.isActiveProperty.link( function( active ) {
      self.visible = active;
    } );

    // TracerNode lasts for the lifetime of the sim, so links don't need to be disposed.
  }

  projectileMotion.register( 'TracerNode', TracerNode );

  return inherit( Node, TracerNode, {

    /**
     * Get the bounds of just the tracer, excluding the halo node
     * @public
     */
    getJustTracerBounds: function() {
      var tracerBounds = Bounds2.point( this.probeOrigin.x, this.probeOrigin.y );

      // include every child except for the halo in the calculations of tracer bounds
      for ( var i = 1; i < this.children.length; i++ ) {
        tracerBounds.includeBounds( this.globalToParentBounds( this.children[ i ].getGlobalBounds() ) );
      }
      return tracerBounds;
    },

    /**
     * Auxiliary function to create label and number readout for information
     * @private
     *
     * @param {number} maxWidth - max width for the label and value display
     * @param {string} labelString
     * @param {Property} readoutProperty
     */
    createInformationBox: function( maxWidth, labelString, readoutProperty ) {
      
      // width of white rectangular background, also used for calculating max width
      var backgroundWidth = 60;

      // label
      var labelText = new Text( labelString, _.defaults( {
        maxWidth: maxWidth - backgroundWidth - 25
      }, LABEL_OPTIONS ) );

      // number
      var numberOptions = _.defaults( { maxWidth: backgroundWidth - 6 }, ProjectileMotionConstants.LABEL_TEXT_OPTIONS );
      var numberNode = new Text( readoutProperty.get(), numberOptions );

      var backgroundNode = new Rectangle(
        0,
        0,
        backgroundWidth,
        numberNode.height + 2 * SPACING, {
          cornerRadius: 4,
          fill: 'white',
          stroke: 'black',
          lineWidth: 0.5
        }
      );

      // update text readout if information changes
      readoutProperty.link( function( readout ) {
        numberNode.setText( readout );
        numberNode.center = backgroundNode.center;
      } );

      var readoutParent = new Node( { children: [ backgroundNode, numberNode ] } );

      var spacing = maxWidth - labelText.width - readoutParent.width - 4 * this.spacing;

      return new HBox( { spacing: spacing, children: [ labelText, readoutParent ] } );
    },

    /**
     * Create icon of Tracer node
     * @public
     *
     * @returns {Node}
     */
    createIcon: function() {
      var rectangle = new Rectangle(
        0,
        0,
        TRACER_CONTENT_WIDTH,
        95, {
          cornerRadius: 8,
          fill: OPAQUE_BLUE,
          stroke: 'gray',
          lineWidth: 4,
          opacity: 0.8,
          pickable: true,
          cursor: 'pointer'
        }
      );

      // crosshair view
      var crosshairShape = new Shape()
        .moveTo( -CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
        .lineTo( CIRCLE_AROUND_CROSSHAIR_RADIUS, 0 )
        .moveTo( 0, -CIRCLE_AROUND_CROSSHAIR_RADIUS )
        .lineTo( 0, CIRCLE_AROUND_CROSSHAIR_RADIUS );

      var crosshair = new Path( crosshairShape, { stroke: 'black' } );
      var circle = new Circle( CIRCLE_AROUND_CROSSHAIR_RADIUS, { lineWidth: 2, stroke: 'black', fill: TRANSPARENT_WHITE } );

      // Create the base of the crosshair
      var crosshairMount = new Rectangle( 0, 0, 0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS, 0.4 * CIRCLE_AROUND_CROSSHAIR_RADIUS, { fill: 'gray' } );
      var timeBox = this.createInformationBox( TRACER_CONTENT_WIDTH, timeString, new Property( '-' ) );
      var rangeBox = this.createInformationBox( TRACER_CONTENT_WIDTH, rangeString, new Property( '-' ) );
      var heightBox = this.createInformationBox( TRACER_CONTENT_WIDTH, heightString, new Property( '-' ) );

      var textBox = new VBox( {
        align: 'left',
        spacing: SPACING,
        children: [
          timeBox,
          rangeBox,
          heightBox
        ]
      } );

      var probeOrigin = Vector2.createFromPool( 0, 0 );

      crosshair.center = probeOrigin;
      circle.center = probeOrigin;
      crosshairMount.left = probeOrigin.x + CIRCLE_AROUND_CROSSHAIR_RADIUS;
      crosshairMount.centerY = probeOrigin.y;
      rectangle.left = crosshairMount.right;
      rectangle.centerY = probeOrigin.y;
      textBox.left = rectangle.left + 2 * SPACING;
      textBox.top = rectangle.top + 2 * SPACING;

      probeOrigin.freeToPool();

      var tracerIcon = new Node( {
        children: [
          crosshairMount,
          rectangle,
          circle,
          crosshair,
          textBox
        ]
      } );

      return tracerIcon;
    }
  } );
} );

