/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

module.exports = function sendOK(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.silly('res.ok() :: Sending 200 ("OK") response');

    // Set status code
    res.status(200);

    // If appropriate, serve data as JSON(P)
    if (req.wantsJSON) {
        if (req.options.model) {
            if (req.headers.count) {
                let opts = {}

                if (req.body.or)
                    opts['or'] = req.body.or;

                if (req.body.where)
                    opts['where'] = req.body.where;
                    
                return sails.models[req.options.model].count(opts, (err, count) => {
                    if (err)
                        res.serverError(err);
                    res.headers['count'] = count;
                    return res.jsonx(data);
                });
            }
            return res.jsonx(data);
        }
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = (typeof options === 'string')
        ? {
            view: options
        }
        : options || {};

    // If a view was provided in options, serve it.
    // Otherwise try to guess an appropriate view, or if that doesn't
    // work, just send JSON.
    if (options.view) {
        return res.view(options.view, {data: data}) // If no second argument provided, try to serve the implied view,
        // but fall back to sending JSON(P) if no view can be inferred.;
    } else
        return res.guessView({
            data: data
        }, function couldNotGuessView() {
            return res.jsonx(data);
        });

    }
;