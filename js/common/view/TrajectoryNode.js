// Copyright 2016, University of Colorado Boulder

/**
 * Trajectory view.
 *
 * @author Andrea Lin
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ProjectileNode = require( 'PROJECTILE_MOTION/common/view/ProjectileNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  // constants
  var ARROW_FILL_COLOR = ProjectileMotionConstants.ARROW_FILL_COLOR;
  var ARROW_HEAD_WIDTH = ProjectileMotionConstants.ARROW_HEAD_WIDTH;
  var ARROW_TAIL_WIDTH = ProjectileMotionConstants.ARROW_TAIL_WIDTH;
  var ARROW_SIZE_DEFAULT = ProjectileMotionConstants.ARROW_SIZE_DEFAULT;

  /**
   * @param {Trajectory} trajectory - model for the trajectory
   * @param {Property} velocityVectorComponentsOnProperty - whether those vectors should be visible
   * @param {ModelViewTransform2} modelViewTransform - meters to scale, inverted y axis, translated origin
   * @constructor
   */
  function TrajectoryNode( trajectory, velocityVectorComponentsOnProperty, modelViewTransform ) {
    var thisNode = this;
    Node.call( thisNode, { pickable: false } );

    this.transformedBallSize = modelViewTransform.modelToViewDeltaX( trajectory.diameter );
    this.tranformedUnit = modelViewTransform.modelToViewDeltaX( 1 );
    this.tranformedArrowSize = this.tranformedUnit * ARROW_SIZE_DEFAULT;

    // add projectile view
    thisNode.projectile = new ProjectileNode( this.transformedBallSize / 2 );
    thisNode.addChild( thisNode.projectile );

    // add vector view for velocity x component
    var velocityXArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    thisNode.addChild( velocityXArrow );

    // add vector view for velocity y component
    var velocityYArrow = new ArrowNode( 0, 0, 0, 0, {
      pickable: false,
      fill: ARROW_FILL_COLOR,
      tailWidth: ARROW_TAIL_WIDTH,
      headWidth: ARROW_HEAD_WIDTH
    } );
    thisNode.addChild( velocityYArrow );

    // update velocity vector visibilities, positions, and magnitudes
    Property.multilink( [
      trajectory.xVelocityProperty,
      trajectory.yVelocityProperty,
      velocityVectorComponentsOnProperty
    ], function( xVelocity, yVelocity, velocityVectorComponentsOn ) {
      velocityXArrow.visible = velocityVectorComponentsOn;
      velocityYArrow.visible = velocityVectorComponentsOn;

      // update size and position if checkbox is checked
      if ( velocityVectorComponentsOn ) {
        var x = modelViewTransform.modelToViewX( trajectory.x );
        var y = modelViewTransform.modelToViewY( trajectory.y );
        velocityXArrow.setTailAndTip( x,
          y,
          x + thisNode.tranformedArrowSize * xVelocity,
          y
        );
        velocityYArrow.setTailAndTip( x,
          y,
          x,
          y - thisNode.tranformedArrowSize * yVelocity
        );
      }
    } );

    // datapoints layer, represented as dots (circles with radius 1)
    thisNode.pathLayer = new Node();
    thisNode.addChild( thisNode.pathLayer );

    function handleDataPointAdded( addedPoint ) {
      // Create and add the view representation for this trajectory
      var addedPointNode = new Circle( 1, {
        x: modelViewTransform.modelToViewX( addedPoint.x ),
        y: modelViewTransform.modelToViewY( addedPoint.y ),
        fill: 'black'
      } );

      thisNode.pathLayer.addChild( addedPointNode );

      // move projectile to new position
      thisNode.projectile.x = modelViewTransform.modelToViewX( addedPoint.x );
      thisNode.projectile.y = modelViewTransform.modelToViewY( addedPoint.y );

      // Add the removal listener for if and when this datapoint is removed from the model.
      trajectory.dataPoints.addItemRemovedListener( function removalListener( removedTrajectory ) {
        if ( removedTrajectory === addedPoint ) {
          thisNode.pathLayer.removeChild( addedPointNode );
          trajectory.dataPoints.removeItemRemovedListener( removalListener );
        }
      } );
    }

    // view listens to whether a datapoint has been added in the model
    trajectory.dataPoints.forEach( handleDataPointAdded );
    trajectory.dataPoints.addItemAddedListener( handleDataPointAdded );
  }

  projectileMotion.register( 'TrajectoryNode', TrajectoryNode );

  return inherit( Node, TrajectoryNode );
} );
