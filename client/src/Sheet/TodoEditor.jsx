import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { io } from "socket.io-client";
import { useSocketContext } from "../context/SocketContext";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

export default function TodoEditor({ todoId, isCompleted, onToggleComplete }) {
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    // const socket = useSocketContext();
    // console.log(socket, "socket")

    useEffect(() => {
        const s = io("http://localhost:5000");
        setSocket(s);
        return () => s.disconnect();
    }, []);

    useEffect(() => {
        if (socket == null || quill == null) return;

        socket.once("load-document", document => {
            quill.setContents(document);
            quill.enable();
        });

        socket.emit("get-document", todoId);
    }, [socket, quill, todoId]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents());
        }, SAVE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = delta => {
            quill.updateContents(delta);
        };
        socket.on("receive-changes", handler);
        return () => socket.off("receive-changes", handler);
    }, [socket, quill]);

    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return;
            socket.emit("send-changes", delta);
        };
        quill.on("text-change", handler);
        return () => quill.off("text-change", handler);
    }, [socket, quill]);

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: {
                toolbar: TOOLBAR_OPTIONS
            },
            placeholder: "Write your todo details...",
        });
        q.disable();
        q.setText("Loading...");
        setQuill(q);
    }, []);

    return (
        <div className="todo-item d-flex align-items-start gap-3 p-3">
            <div className="form-check">
                <input
                    className="form-check-input custom-checkbox"
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => onToggleComplete(todoId, e.target.checked)}
                    id={`todo-${todoId}`}
                />
            </div>
            <div className="todo-editor flex-grow-1" ref={wrapperRef}></div>
        </div>
    );
}