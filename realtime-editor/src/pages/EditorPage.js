
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ACTIONS from '../Action';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import logoImg from '../image/code-sync.png';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            // Guard: Prevent double-initialization
            if (socketRef.current) return;

            socketRef.current = await initSocket();

            if (!isMounted) return;

            const handleErrors = (e) => {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            };

            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);

            // Join Room
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listen for JOINED
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
                
                // Only sync if code exists
                if (codeRef.current) {
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            });

            // Listen for DISCONNECTED
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                if (username) toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter((c) => c.socketId !== socketId));
            });
        };

        init();

        // THE CLEANUP: Essential to stop the "Emit on null" error
        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
                socketRef.current.off('connect_error');
                socketRef.current.off('connect_failed');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [reactNavigator, roomId, location.state?.username]);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied');
        } catch (err) {
            toast.error('Could not copy the Room ID');
        }
    }

    if (!location.state) return <Navigate to="/" />;

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImage" src={logoImg} alt="logo" />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
                <button className="btn leaveBtn" onClick={() => reactNavigator('/')}>Leave</button>
            </div>
            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => { codeRef.current = code; }}
                />
            </div>
        </div>
    );
};

export default EditorPage;