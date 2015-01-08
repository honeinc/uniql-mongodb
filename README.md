UniQL-MongoDB
=======

This generates MongoDB queries based on [UniQL](https://github.com/honeinc/uniql) ASTs.

## Example

```javascript
var parse = require( 'uniql' );
var mongoCompile = require( 'uniql-mongodb' );

var ast = parse( '( height <= 20 or ( favorites.color == "green" and height != 25 ) ) and firstname ~= "o.+"' );
var mongoQuery = mongoCompile( ast );
console.log( util.inspect( mongoQuery, { depth: null } ) );
```

Resulting query:

```
{ '$or': 
   [ { height: { '$lte': 20 } },
     { 'favorites.color': 'green', height: { '$ne': 25 } } ],
  firstname: { '$regex': 'o.+' } }
```

## License

[MIT](LICENSE)
