      /**
       * Join
       * Join string with given content
       *
       * Usage:
       *
       *    <p>
       *        {{#join companies "<br>"}}
       *            {{name}}
       *        {{/join}}
       *    </p>
       *
       */

        Handlebars.registerHelper( "join", function( array, sep, options ) {
            return array.map(function( item ) {
                return options.fn( item );
            }).join( sep );
        });
