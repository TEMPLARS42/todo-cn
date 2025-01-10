const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: { type: String },
    name: { type: String },
    activeMembers: [{
        name: { type: String },
        socketId: { type: String }
    }]
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

const Room = mongoose.model('room', roomSchema);
module.exports = Room;


