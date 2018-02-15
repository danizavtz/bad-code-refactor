(function() {
    'use strict';
    exports.pokemonValidate = (req, res, next) => {
    	req.checkBody('name', 'is required').isAlpha();
    	req.checkBody('price', 'must be numeric').isNumeric();
    	req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            return next();
        });
    };

    exports.pokemonFindValidate = (req, res, next) =>{
    	req.checkBody('name', 'is required').isAlpha();
    	req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            return next();
        });
    }
})();
