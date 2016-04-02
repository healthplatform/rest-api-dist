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
            var visit = this.toObject();
            for (var key in visit)
                if (!visit[key])
                    delete visit[key];
            return visit;
        }
    }
};
