import { useEffect, useState } from 'react';
import TodoEditor from './Sheet/TodoEditor';
import { Plus, X } from 'lucide-react';
import { useSocketContext } from './context/SocketContext';
import { useParams } from 'react-router-dom';

export default function TodoList() {
    const { roomId } = useParams();
    // const roomId = "5225";
    const [todos, setTodos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [roomName, setRoomName] = useState("");
    const [newRoomName, setNewRoomName] = useState(roomName);
    const socket = useSocketContext();

    useEffect(() => {
        if (socket == null) return;

        socket.emit("get-todos", roomId);
        socket.on("load-todos", data => {
            setTodos(data.todos);
            setRoomName(data.roomName);
        });

        socket.on("todo-added", data => {
            console.log(data, "added")
            setTodos(prev => [{ _id: data.todoId, completed: false }, ...prev])
        })

        socket.on("room-name-updated", data => {
            setRoomName(data);
        })

        socket.on("todo-removed", todoId => {
            setTodos(prev => prev.filter(todo => todo._id !== todoId))
        })

        socket.on("todo-toggled", todoId => {
            setTodos(prev => prev.map(todo => todo._id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo))
        })
    }, [socket, roomId]);

    const toggleTodo = (id, action) => {
        setTodos(todos.map(todo =>
            todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        ));

        socket.emit("toggled-todo", { todoId: id, roomId, action })
    };

    const addTodo = () => {
        socket.emit("add-todo", roomId)
    }

    const removeTodo = (id) => {
        socket.emit("remove-todo", id);
        setTodos(todos.filter(todo => todo._id !== id));
    }

    const handleSave = () => {
        if (newRoomName.trim()) {
            setRoomName(newRoomName); // Update the room name if it's not empty
        }
        setIsEditing(false); // Switch back to viewing mode

        socket.emit("update-room-name", { roomId, newRoomName });
    };
    return (
        <div className="todo-container">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {isEditing ? (
                        <input
                            type="text"
                            className="form-control todo-title mb-0"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            onBlur={handleSave} // Save changes when input loses focus
                            autoFocus
                        />
                    ) : (
                        <h1
                            className="todo-title mb-0"
                            onClick={() => setIsEditing(true)} // Enable editing on click
                            style={{ cursor: 'pointer' }} // Change cursor to indicate it's clickable
                        >
                            {roomName}
                        </h1>
                    )}
                    <button
                        onClick={addTodo}
                        type='button'
                        className="btn btn-primary d-flex align-items-center gap-2 add-todo-btn"
                        title="Add new todo"
                    >
                        <Plus size={24} />
                    </button>
                </div>
                {todos.length > 0 && <div className="todo-list">
                    {todos.map(todo => (
                        <div className='d-flex gap-4'>
                            <TodoEditor
                                key={todo._id}
                                todoId={todo._id}
                                isCompleted={todo.isCompleted}
                                onToggleComplete={toggleTodo}
                            />
                            <div className='d-flex align-items-center'>
                                <button
                                    onClick={() => removeTodo(todo._id)}
                                    type='button'
                                    className="btn btn-danger d-flex align-items-center gap-2 add-todo-btn"
                                    title="Add new todo"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    );
}