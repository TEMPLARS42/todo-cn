require('dotenv').config();
const express = require('express');
const http = require('http');
const { PORT } = process.env;
const { Server } = require("socket.io");
const connectDB = require('./configs/dbConfig');
const TodoModal = require("./schema/todo.schema");
const RoomModal = require("./schema/room.schema");
const { generateRandomName } = require('./utils/common.util');
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

connectDB();
const defaultValue = ""

io.on("connection", socket => {
    socket.on("get-document", async todoId => {
        const document = await findOrCreateTodo(todoId)
        socket.join(todoId)
        socket.emit("load-document", document.data)

        socket.on("send-changes", delta => {
            socket.broadcast.to(todoId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            await TodoModal.findByIdAndUpdate(todoId, { data })
        })
    })

    socket.on("get-todos", async roomId => {
        let todos = [];
        let roomInfo = await RoomModal.findOne({ roomId: roomId })
        if (roomInfo) {
            await RoomModal.updateOne({ roomId: roomId }, { $push: { activeMembers: { name: generateRandomName(), socketId: socket.id } } })
            todos = await TodoModal.find({ roomId: roomId }, { _id: 1, isCompleted: 1 }).sort({ createdOn: -1 }).lean();
        }
        else {
            roomInfo = await RoomModal.create({
                roomId: roomId, name: "Untitled Room", activeMembers: [{
                    name: generateRandomName(),
                    socketId: socket.id
                }]
            })
        }

        socket.join(roomId)
        socket.emit("load-todos", { todos, activeMembers: roomInfo.activeMembers, roomName: roomInfo.name })
    })

    socket.on("add-todo", async roomId => {
        let roomInfo = await RoomModal.findOne({ roomId: roomId })
        if (roomInfo) {
            const todoInfo = await TodoModal.create({
                data: defaultValue, roomId: roomId
            })
            io.in(roomId).emit("todo-added", { todoId: todoInfo._id });
        }
    })

    socket.on("remove-todo", async ({ todoId, roomId }) => {
        await TodoModal.deleteOne({ _id: new ObjectId(todoId) });
        socket.in(roomId).emit("todo-removed", todoId);
    })

    socket.on("toggled-todo", async ({ todoId, roomId, action }) => {
        await TodoModal.updateOne({ _id: new ObjectId(todoId) }, { $set: { isCompleted: JSON.parse(action) } });
        socket.in(roomId).emit("todo-toggled", todoId);
    })

    socket.on("update-room-name", async ({ roomId, newRoomName }) => {
        await RoomModal.updateOne({ roomId: roomId }, { $set: { name: newRoomName } })
        socket.in(roomId).emit("room-name-updated", newRoomName);
    })

    // Handle when a user leaves a room
    socket.on("disconnect", async () => {
        // console.log("socket disconnected", socket.id)

        // Find all rooms the socket was part of
        await RoomModal.updateMany({}, { $pull: { activeMembers: { socketId: socket.id } } });
    })
})

async function findOrCreateTodo(id) {
    if (!id) return
    const todo = await TodoModal.findById(id)
    if (todo) return todo
}


server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
