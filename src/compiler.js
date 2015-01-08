'use strict';

module.exports = compile;

var generators = {
    "NUMBER": function( node ) {
        return node.arguments[ 0 ];
    },
    "STRING": function( node ) {
        return '"' + node.arguments[ 0 ].replace( '"', '\\"' ) + '"';
    },
    "SYMBOL": function( node ) {
        return '"' + node.arguments[ 0 ] + '"';
    },
    
    "-": function( node ) {
        return -node.arguments[ 0 ];
    },
    "&&": function( node ) {
        var result = [];
        node.arguments.forEach( function( arg ) {
           result.push( _processNode( arg ) );
        } );
        return ' ' + result.join( ',\n' );
    },
    "||": function( node ) {
        var result = [];
        node.arguments.forEach( function( arg ) {
            result.push( ' { ' + _processNode( arg ) + '}' );
        } );
        return ' "$or": [ ' + result.join( ',\n' ) + ' ]\n'; 
    },
    "IN": function( node ) {
        var value = _processNode( node.arguments[ 0 ] );
        var field = _processNode( node.arguments[ 1 ] );
        return ' ' + field + ': { "$in": [ ' + value + ' ] }\n';
    },
    "!": function() {
        throw new Error( '! operator not supported by mongodb' );
    },
    "==": function( node ) {
        if ( node.arguments[ 0 ].type !== 'SYMBOL' ) {
            throw new Error( 'mongodb only supports left hand side symbols in equality tests' );
        }
        return ' ' + _processNode( node.arguments[ 0 ] ) + ': ' + _processNode( node.arguments[ 1 ] ) + ' ';
    },
    "!=": function( node ) {
        if ( node.arguments[ 0 ].type !== 'SYMBOL' ) {
            throw new Error( 'mongodb only supports left hand side symbols in equality tests' );
        }
        return ' ' + _processNode( node.arguments[ 0 ] ) + ': { "$ne": ' + _processNode( node.arguments[ 1 ] ) + ' } ';
    },
    "MATCH": function( node ) {
        if ( node.arguments[ 0 ].type !== 'SYMBOL' ) {
            throw new Error( 'mongodb only supports left hand side symbols in matching tests' );
        }
        return ' ' + _processNode( node.arguments[ 0 ] ) + ': { "$regex": ' + _processNode( node.arguments[ 1 ] ) + ' } ';
    },
    "<": function( node ) {
        if ( node.arguments[ 0 ].type !== 'SYMBOL' ) {
            throw new Error( 'mongodb only supports left hand side symbols in comparison tests' );
        }
        return ' ' + _processNode( node.arguments[ 0 ] ) + ': { "$lt": ' + _processNode( node.arguments[ 1 ] ) + ' } ';
    },    
    "<=": function( node ) {
        if ( node.arguments[ 0 ].type !== 'SYMBOL' ) {
            throw new Error( 'mongodb only supports left hand side symbols in comparison tests' );
        }
        return ' ' + _processNode( node.arguments[ 0 ] ) + ': { "$lte": ' + _processNode( node.arguments[ 1 ] ) + ' } ';
    },    
    ">": function( node ) {
        if ( node.arguments[ 0 ].type !== 'SYMBOL' ) {
            throw new Error( 'mongodb only supports left hand side symbols in comparison tests' );
        }
        return ' ' + _processNode( node.arguments[ 0 ] ) + ': { "$gt": ' + _processNode( node.arguments[ 1 ] ) + ' } ';
    },    
    ">=": function( node ) {
        if ( node.arguments[ 0 ].type !== 'SYMBOL' ) {
            throw new Error( 'mongodb only supports left hand side symbols in comparison tests' );
        }
        return ' ' + _processNode( node.arguments[ 0 ] ) + ': { "$gte": ' + _processNode( node.arguments[ 1 ] ) + ' } ';
    },
    "EXPRESSION": function( node ) {
        var result = [];
        node.arguments.forEach( function( arg ) {
            result.push( _processNode( arg ) );
        } );
        return ' ' + result.join( ',\n' );        
    }
};

function _processNode( node ) {
    if ( !( node.type in generators ) ) {
        throw new Error( 'invalid node type' );
    }
    
    return generators[ node.type ]( node );
}

function compile( tree ) {
    var json = '{' + _processNode( tree ) + '}';
    return JSON.parse( json );
}