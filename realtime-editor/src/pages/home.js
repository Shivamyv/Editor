
import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// 1. IMPORT THE LOGO HERE
import codeSyncLogo from '../image/code-sync.png'; 

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img 
                    className='homePageLogo' 
                    src={codeSyncLogo} // Now defined via import
                    alt="code-sync-logo" 
                />

                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className='inputGroup'>
                    <input 
                        type="text" 
                        className="inputBox" 
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input 
                        type="text" 
                        className="inputBox" 
                        placeholder="USERNAME" 
                        // 2. FIXED CASE SENSITIVITY: setUsername
                        onChange={(e) => setUsername(e.target.value)} 
                        value={username}
                        onKeyUp={handleInputEnter}
                    />

                    <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                    <span className='createInfo'>
                        If you don't have an invite, create &nbsp;
                        <a 
                            onClick={createNewRoom} 
                            href="#" // 3. PREVENT REFRESH
                            className='createNewBtn'
                        > 
                            New room 
                        </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4> 
                    Built with 💛&nbsp; by &nbsp;
                    <a href="https://github.com/Shivamyv">Shivam's code</a>
                </h4>
            </footer>
        </div>
    );
};

export default Home;

