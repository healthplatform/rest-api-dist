"use strict";
exports.Contact = {
    identity: 'contact_tbl',
    connection: 'postgres',
    attributes: {
        first_name: {
            type: 'string'
        },
        last_name: {
            type: 'string'
        },
        street: {
            type: 'string'
        },
        suburb: {
            type: 'string'
        },
        state: {
            type: 'string'
        },
        country: {
            type: 'string'
        },
        contact0: {
            type: 'string'
        },
        contact1: {
            type: 'string'
        },
        description: {
            type: 'string',
            required: true
        },
        toJSON: function toJSON() {
            var visit = this.toObject();
            for (var key in visit)
                if (!visit[key])
                    delete visit[key];
            return visit;
        },
        save: function () {
            console.log('Contact::save::arguments =', arguments);
        }
    }
};
