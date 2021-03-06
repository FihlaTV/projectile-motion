// Copyright 2017-2019, University of Colorado Boulder

/**
 * Control panel that allows users to modify initial values for how the cannon fires a projectile.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const angleString = require( 'string!PROJECTILE_MOTION/angle' );
  const heightString = require( 'string!PROJECTILE_MOTION/height' );
  const initialValuesString = require( 'string!PROJECTILE_MOTION/initialValues' );
  const metersPerSecondString = require( 'string!PROJECTILE_MOTION/metersPerSecond' );
  const mString = require( 'string!PROJECTILE_MOTION/m' );
  const pattern0Value1UnitsString = require( 'string!PROJECTILE_MOTION/pattern0Value1Units' );
  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );
  const speedString = require( 'string!PROJECTILE_MOTION/speed' );

  // constants
  const TITLE_OPTIONS = ProjectileMotionConstants.PANEL_TITLE_OPTIONS;
  const LABEL_OPTIONS = ProjectileMotionConstants.PANEL_LABEL_OPTIONS;
  const DEGREES = MathSymbols.DEGREES;

  /**
   * Control panel constructor
   * @param {Property.<number>} cannonHeightProperty - height of the cannon
   * @param {Property.<number>} cannonAngleProperty - angle of the cannon, in degrees
   * @param {Property.<number>} initialSpeedProperty - velocity of next projectile to be fired
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function InitialValuesPanel( cannonHeightProperty, cannonAngleProperty, initialSpeedProperty, tandem, options ) {

    // The first object is a placeholder so none of the others get mutated
    // The second object is the default, in the constants files
    // The third object is options specific to this panel, which overrides the defaults
    // The fourth object is options given at time of construction, which overrides all the others
    options = merge( {}, ProjectileMotionConstants.RIGHTSIDE_PANEL_OPTIONS, { yMargin: 5 }, options );

    // local vars for layout and formatting
    const titleOptions = merge( {}, TITLE_OPTIONS, { maxWidth: options.minWidth - 2 * options.xMargin } );
    const parameterLabelOptions = merge( {}, LABEL_OPTIONS, { maxWidth: options.minWidth - 2 * options.xMargin } );

    /**
     * Auxiliary function that creates vbox for a parameter label and slider
     * @param {string} labelString - label for the parameter
     * @param {string} unitsString - units
     * @param {Property.<number>} valueProperty - the Property that is set and linked to
     * @param {Range} range - range for the valueProperty value
     * @param {Tandem} tandem
     * @param {string} [degreeString] - just for the angle
     * @returns {VBox}
     */
    function createReadout( labelString, unitsString, valueProperty, range, tandem, degreeString ) {
      const parameterLabel = new Text( '', merge( {}, parameterLabelOptions, {
        tandem: tandem,
        phetioComponentOptions: { textProperty: { phetioReadOnly: true } }
      } ) );

      valueProperty.link( function( value ) {
        const valueReadout = degreeString ?
                             StringUtils.fillIn( pattern0Value1UnitsString, {
                               value: Utils.toFixedNumber( value, 2 ),
                               units: degreeString
                             } ) :
                             StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, {
                               value: Utils.toFixedNumber( value, 2 ),
                               units: unitsString
                             } );
        parameterLabel.setText( labelString + ': ' + valueReadout );
      } );

      return new VBox( {
        align: 'left',
        children: [ parameterLabel, new HStrut( options.minWidth - 2 * options.xMargin ) ]
      } );
    }

    const heightReadout = createReadout(
      heightString,
      mString,
      cannonHeightProperty,
      ProjectileMotionConstants.CANNON_HEIGHT_RANGE,
      tandem.createTandem( 'heightReadout' )
    );

    const angleReadout = createReadout(
      angleString,
      null,
      cannonAngleProperty,
      ProjectileMotionConstants.CANNON_ANGLE_RANGE,
      tandem.createTandem( 'angleReadout' ),
      DEGREES
    );

    const velocityReadout = createReadout(
      speedString,
      metersPerSecondString,
      initialSpeedProperty,
      ProjectileMotionConstants.LAUNCH_VELOCITY_RANGE,
      tandem.createTandem( 'velocityReadout' )
    );

    // contents of the panel
    const content = new VBox( {
      align: 'left',
      spacing: options.controlsVerticalSpace / 3,
      children: [
        heightReadout,
        angleReadout,
        velocityReadout
      ]
    } );

    const initialValuesTitle = new Text( initialValuesString, titleOptions );

    const initialValuesVBox = new VBox( {
      align: 'center',
      spacing: 0,
      children: [
        initialValuesTitle,
        content
      ]
    } );

    Panel.call( this, initialValuesVBox, options );

    // content.left = this.left;
  }

  projectileMotion.register( 'InitialValuesPanel', InitialValuesPanel );

  return inherit( Panel, InitialValuesPanel );
} );