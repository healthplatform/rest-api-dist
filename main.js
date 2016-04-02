"use strict";
var async = require('async');
var restify = require('restify');
var redis = require('redis');
var Waterline = require('waterline');
var sails_postgresql = require('sails-postgresql');
var bunyan_1 = require('bunyan');
var helpers_1 = require('./utils/helpers');
var SampleData_1 = require('./utils/SampleData');
var package_ = require('./package');
var logger = bunyan_1.createLogger({
    name: 'main'
});
if (!process.env.NO_DEBUG) {
    var i = {};
    Object.keys(process.env)
        .sort()
        .forEach(function (k) {
        i[k] = process.env[k];
    });
    logger.info(JSON.stringify(i, null, 4));
    logger.info('------------');
}
var db_uri = process.env.RDBMS_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL;
var config = {
    adapters: {
        url: db_uri,
        postgres: sails_postgresql
    },
    defaults: {
        migrate: 'create',
    },
    connections: {
        postgres: helpers_1.trivial_merge({
            adapter: 'postgres'
        }, !process.env.DOKKU_POSTGRES_REST_API_DB_PORT_5432_TCP_ADDR ?
            helpers_1.uri_to_config(db_uri) : {
            "database": db_uri.substr(db_uri.lastIndexOf('/') + 1),
            "host": process.env.DOKKU_POSTGRES_REST_API_DB_PORT_5432_TCP_ADDR,
            "identity": "postgres",
            "password": process.env.DOKKU_POSTGRES_REST_API_DB_ENV_POSTGRES_PASSWORD,
            "user": "postgres",
        })
    }
};
exports.all_models_and_routes = helpers_1.populateModelRoutes('.');
exports.cursors = {
    redis: null
};
exports.collections = null;
function main(models_and_routes, callback, skip_db, createSampleData) {
    if (skip_db === void 0) { skip_db = false; }
    if (createSampleData === void 0) { createSampleData = !process.env.NO_SAMPLE_DATA; }
    var app = restify.createServer();
    var root = '/api';
    app.use(restify.queryParser());
    app.use(restify.bodyParser());
    app.on('after', restify.auditLogger({
        log: bunyan_1.createLogger({
            name: 'audit',
            stream: process.stdout
        })
    }));
    ['/', '/version', '/api', '/api/version'].map(function (route_path) { return app.get(route_path, function (req, res, next) {
        res.json({ version: package_.version });
        next();
    }); });
    var waterline = new Waterline();
    function tryTblInit(entity) {
        return function tryInit(model) {
            models_and_routes[entity].models
                && (models_and_routes[entity].models[model].identity
                    ||
                        models_and_routes[entity].models[model].tableName)
                ?
                    waterline.loadCollection(Waterline.Collection.extend(models_and_routes[entity].models[model]))
                : logger.warn("Not initialising: " + entity + "." + model);
        };
    }
    models_and_routes['contact'] && tryTblInit('contact')('Contact');
    models_and_routes['kv'] && tryTblInit('kv')('KV');
    Object.keys(models_and_routes).map(function (entity) {
        if (models_and_routes[entity].routes)
            Object.keys(models_and_routes[entity].routes).map(function (route) { return models_and_routes[entity].routes[route](app, root + "/" + entity); });
        if (models_and_routes[entity].models)
            Object.keys(models_and_routes[entity].models).map(tryTblInit(entity));
    });
    if (callback && skip_db)
        return callback(app);
    exports.cursors.redis = redis.createClient(process.env.REDIS_URL);
    exports.cursors.redis.on('error', function (err) {
        logger.error("Redis::error event -\n            " + exports.cursors.redis['host'] + ":" + exports.cursors.redis['port'] + "\n            - " + err);
        logger.error(err);
    });
    waterline.initialize(config, function (err, ontology) {
        if (err !== null)
            throw err;
        exports.collections = (ontology.collections);
        logger.info('ORM initialised with collections:', Object.keys(exports.collections));
        if (callback)
            return callback(app, ontology.connections);
        else
            app.listen(process.env.PORT || 3000, function () {
                logger.info('%s listening at %s', app.name, app.url);
                if (createSampleData) {
                    var sampleData_1 = new SampleData_1.SampleData(app.url);
                    async.series([
                        function (cb) { return sampleData_1.deletePatientsHttp(cb); },
                        function (cb) { return sampleData_1.loadPatientsHttp(cb); },
                        function (cb) { return sampleData_1.deleteHistoricHttp(cb); },
                        function (cb) { return sampleData_1.loadHistoricHttp(cb); },
                        function (cb) { return sampleData_1.loadVisitsHttp(cb); },
                    ], function (err, results) {
                        if (err)
                            console.error(err);
                        else
                            console.info(results.map(function (result) {
                                return result instanceof Array ?
                                    (_a = {}, _a[result[0].func_name] = result.map(function (r) { return (r.statusCode + " " + r.statusCode + ", "); }), _a) :
                                    (_b = {}, _b[result.func_name] = result.statusCode + " " + result.statusCode + ", ", _b);
                                var _a, _b;
                            }));
                    });
                }
            });
    });
}
exports.main = main;
if (require.main === module) {
    main(exports.all_models_and_routes);
}
