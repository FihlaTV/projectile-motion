// Copyright 2016, University of Colorado Boulder

/**
 * This object is collection of constants that configure global properties.
 * If you change something here, it will change *everywhere* in this simulation.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var ProjectileMotionConstants = {

    DEFAULT_VELOCITY: 18, // m/s
    DEFAULT_ANGLE: 80, // degrees
    DEFAULT_MASS: 5, // kg
    DEFAULT_DIAMETER: 0.37, // of a pumpkin, in meters
    DEFAULT_DRAG_COEFFICIENT: 6,
    DEFAULT_AIR_RESISTANCE_ON: false,


    LABEL_FONT: new PhetFont( 18 ),

    VELOCITY_RANGE: { min: 0, max: 50 },
    ANGLE_RANGE: { min: -90, max: 180 },
    MASS_RANGE: { min: 0.04, max: 100 }, // in original, highest is 1000
    DIAMETER_RANGE: { min: 0.1, max: 2.5 }, // in original, smallest is 0.043

    INITIAL_TRAJECTORY_X: 0,
    INITIAL_TRAJECTORY_Y: 0,

    INITIAL_TAPE_MEASURE_X: 0,
    INITIAL_TAPE_MEASURE_Y: -2 // in meters

  };

  projectileMotion.register( 'ProjectileMotionConstants', ProjectileMotionConstants );

  return ProjectileMotionConstants;

} );
