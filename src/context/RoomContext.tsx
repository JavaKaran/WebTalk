import React, { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from 'socket.io-client';

interface RoomProviderProps {
    children: React.ReactNode;
}

const SocketUrl = import.meta.env.VITE_SOCKET_URL;

const socket: Socket = io(SocketUrl);

export const RoomContext = createContext<any | null>(null);

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {

    const navigate  = useNavigate();

    const enterRoom = ({ roomId }: { roomId: string }) => {
        navigate(`room/${roomId}`);
    }

    const newUserJoined = () => {
        console.log("A new user has joined this room");
    }

    useEffect(() => {        
        socket.on('room-created', enterRoom);
        socket.on('user-joined', newUserJoined);

        return () => {
            socket.off('room-created', enterRoom);
            socket.off('user-joined', newUserJoined);
        }
    }, []);

    return (
        <RoomContext.Provider value={{
            socket: socket
        }}>
            { children }
        </RoomContext.Provider>
    )
}