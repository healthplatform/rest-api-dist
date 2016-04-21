"use strict";
exports.KV = {
    identity: 'kv_tbl',
    connection: 'postgres',
    attributes: {
        key: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        value: {
            type: 'string',
            required: true
        },
        toJSON: function toJSON() {
            var kv = this.toObject();
            for (var key in kv)
                if (kv.hasOwnProperty(key) && !kv[key])
                    delete kv[key];
            return kv;
        }
    }
};
