import { io } from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    
    // Explicitly point to 5001 since that is what your server uses
    return io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001', options);
};