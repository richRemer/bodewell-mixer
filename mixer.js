/**
 * Create function to mixin a type constructor.
 * @param {function} Type
 */
function mixer(Type) {
    var mixed = Symbol("mixed"),
        mix;

    mix = function(context) {
        if (typeof context === "function") {
            Object.assign(context.prototype, Type.prototype);
            context.prototype[mix.symbol] = true;
            return context;
        } else {
            if (!context[mixed]) {
                Object.assign(context, Type.prototype);
                context[mix.symbol] = true;
            }

            Type.apply(context, Array.prototype.slice.call(arguments,1));

            return context;
        }
    };

    mix.symbol = mixed;

    return mix;
}

module.exports = mixer;
