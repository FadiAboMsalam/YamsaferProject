'use strict';

var _ = require('lodash');
var Message = require('./message.model');
var Mixpanel = require('../services/mixpanel');
var express = require('express');
var fadiVar = require('../services/fadi');

// Get list of messages
exports.index = function(req, res) {
    

    var udid = req.param('udid');    
    
    fadiVar.setQuery("properties[\"$first_name\"] == \"" + udid + "\"");
    
    exports.getQuery = function(param1) {        
        res.json(param1);
        res.end();
    };
};


// Get a single message
exports.show = function(req, res) {
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        if (!message) {
            return res.send(404);
        }
        return res.json(message);
    });
};

// Creates a new message in the DB.
exports.create = function(req, res) {
    Message.create(req.body, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, message);
    });
};

// Updates an existing message in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        if (!message) {
            return res.send(404);
        }
        var updated = _.merge(message, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, message);
        });
    });
};

// Deletes a message from the DB.
exports.destroy = function(req, res) {
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        if (!message) {
            return res.send(404);
        }
        message.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}