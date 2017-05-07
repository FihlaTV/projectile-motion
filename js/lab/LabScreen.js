// Copyright 2016, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var LabModel = require( 'PROJECTILE_MOTION/lab/model/LabModel' );
  var LabScreenView = require( 'PROJECTILE_MOTION/lab/view/LabScreenView' );
  var Screen = require( 'JOIST/Screen' );
  var Property = require( 'AXON/Property' );

  // strings
  var labTitleString = require( 'string!PROJECTILE_MOTION/lab.title' );

  /**
   * @constructor
   */
  function LabScreen() {

    var options = {
      name: labTitleString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: ProjectileMotionConstants.RANDOM_ICON_FACTORY.createIcon()
    };

    Screen.call( this,
      function() { return new LabModel(); },
      function( model ) { return new LabScreenView( model ); },
      options
    );
  }

  projectileMotion.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );