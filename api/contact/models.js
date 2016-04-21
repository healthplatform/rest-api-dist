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
            var contact = this.toObject();
            for (var key in contact)
                if (contact.hasOwnProperty(key) && !contact[key])
                    delete contact[key];
            return contact;
        }
    }
};
