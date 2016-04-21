"use strict";
exports.Storage = {
    identity: 'storage_tbl',
    connection: 'postgres',
    attributes: {
        name: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        uploader: {
            type: 'string',
            required: true
        },
        remote_location: {
            type: 'string'
        },
        local_location: {
            type: 'string'
        },
        size: {
            type: 'integer'
        },
        mime_type: {
            type: 'string'
        },
        toJSON: function toJSON() {
            var storage = this.toObject();
            for (var key in storage)
                if (storage.hasOwnProperty(key) && !storage[key])
                    delete storage[key];
            return storage;
        }
    }
};
