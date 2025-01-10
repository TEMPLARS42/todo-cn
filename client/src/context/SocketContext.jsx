import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();
    useEffect(() => {
        const s = io("http://localhost:5000");
        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, []);

    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>;
};

export default SocketProvider;