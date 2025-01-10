const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    data: { type: Object },
    roomId: { type: String },
    isCompleted: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

const ToDo = mongoose.model('todo', todoSchema);
module.exports = ToDo;


