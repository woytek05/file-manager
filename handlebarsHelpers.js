module.exports = {
    ifeq: (a, b, options) => {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifuneq: (a, b, options) => {
        if (a !== b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifincludes: (a, b, options) => {
        if (a.includes(b)) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifnotincludes: (a, b, options) => {
        if (!a.includes(b)) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
};
