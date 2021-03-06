// Copyright 2019, University of Colorado Boulder

/**
 * IO type for Trajectory
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanIO = require( 'TANDEM/types/BooleanIO' );
  const DataPointIO = require( 'PROJECTILE_MOTION/common/model/DataPointIO' );
  const NullableIO = require( 'TANDEM/types/NullableIO' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const validate = require( 'AXON/validate' );
  const NullOrDataPointIO = NullableIO( DataPointIO );

  // constants
  // Name the types needed to serialize each field on the Trajectory so that it can be used in
  // toStateObject, fromStateObject, and setValue.
  const ioTypeSchema = {
    mass: { phetioType: NumberIO },
    diameter: { phetioType: NumberIO },
    dragCoefficient: { phetioType: NumberIO },
    changedInMidAir: { phetioType: BooleanIO },
    reachedGround: { phetioType: BooleanIO },
    apexPoint: { phetioType: NullOrDataPointIO } // serialize as a data type, no reference type
  };

  class TrajectoryIO extends ObjectIO {

    /**
     * @param {Trajectory} trajectory
     * @returns {Object}
     * @override
     */
    static toStateObject( trajectory ) {
      validate( trajectory, this.validator );
      const stateObject = {};
      _.keys( ioTypeSchema ).map( fieldName => {
        stateObject[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.toStateObject( trajectory[ fieldName ] );
      } );
      return stateObject;
    }

    /**
     * @param {Object} stateObject
     * @returns {Object}
     * @override
     */
    static fromStateObject( stateObject ) {
      const fromStateObject = {};
      _.keys( stateObject ).map( fieldName => {
        assert && assert( stateObject.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
        fromStateObject[ fieldName ] = ioTypeSchema[ fieldName ].phetioType.fromStateObject( stateObject[ fieldName ] );
      } );
      return fromStateObject;
    }

    /**
     * @param {Trajectory} trajectory
     * @param {Object} fromStateObject
     * @override
     */
    static setValue( trajectory, fromStateObject ) {
      _.keys( fromStateObject ).map( fieldName => {
        assert && assert( trajectory.hasOwnProperty( fieldName ), `unexpected key: ${fieldName}` );
        trajectory[ fieldName ] = fromStateObject[ fieldName ];
      } );
    }
  }

  TrajectoryIO.documentation = 'A trajectory outlining the projectile\'s path';
  TrajectoryIO.validator = { isValidValue: v => v instanceof phet.projectileMotion.Trajectory };
  TrajectoryIO.typeName = 'TrajectoryIO';
  ObjectIO.validateSubtype( TrajectoryIO );

  return projectileMotion.register( 'TrajectoryIO', TrajectoryIO );
} );
