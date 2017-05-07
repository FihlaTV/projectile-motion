// Copyright 2015, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 * @author Andrea Lin( PhET Interactive Simulations )
 */
define( function( require ) {
  'use strict';

  // modules
  var CustomizeDialog = require( 'PROJECTILE_MOTION/lab/view/CustomizeDialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabProjectilePanel = require( 'PROJECTILE_MOTION/lab/view/LabProjectilePanel' );
  var InitialValuesPanel = require( 'PROJECTILE_MOTION/lab/view/InitialValuesPanel' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );

  /**
   * @param {LabModel} model
   * @constructor
   */
  function LabScreenView( model, options ) {

    options = options || {};

    // customize panel that becomes visible when customize button in second panel is pressed
    this.customizeDialog = new CustomizeDialog( model );

    // second panel includes customizable options
    options = _.extend( {
      secondPanel: new InitialValuesPanel( model.cannonHeightProperty, model.cannonAngleProperty, model.launchVelocityProperty ),
      vectorsPanel: new LabProjectilePanel( model )
    }, options );

    ProjectileMotionScreenView.call( this, model, options );

    this.customizeDialog.center = this.visibleBoundsProperty.get().center.minusXY( 50, 0 );
    this.addChild( this.customizeDialog );

  }

  projectileMotion.register( 'LabScreenView', LabScreenView );

  return inherit( ProjectileMotionScreenView, LabScreenView );
} );

