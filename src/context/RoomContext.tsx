import Peer from "peerjs";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from 'socket.io-client';
import { PeerReducer } from "./PeerReducer";
import { addPeerAction, removePeerAction } from "./PeerActions";
import { v4 as uuidv4} from 'uuid'; 

interface RoomProviderProps {
    children: React.ReactNode;
}

const SocketUrl = import.meta.env.VITE_SOCKET_URL;

const socket: Socket = io(SocketUrl);

export const RoomContext = createContext<any | null>(null);

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {

    const [ peers, dispatch ] = useReducer(PeerReducer, {});

    const navigate  = useNavigate();

    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();

    const enterRoom = ({ roomId }: { roomId: string }) => {
        navigate(`room/${roomId}`);
    }

    const newUserJoined = ({ participants }: { participants: string[] }) => {
        participants.map((peerId) => {
            const call = stream && me?.call(peerId,stream);
            call?.on('stream', (videoStream: MediaStream) => {
                dispatch(addPeerAction(peerId,videoStream));
            })
        })
    }

    const removeUser = (peerId: string) => {
        dispatch(removePeerAction(peerId));
    }

    useEffect(() => {   
        
        const id = uuidv4();
        const peer = new Peer(id);

        setMe(peer);

        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => setStream(stream))
        } catch (err) {
            console.log("Error ====> ", err);
        }

        socket.on('room-created', enterRoom);
        socket.on('get-users', newUserJoined);
        socket.on('user-left', removeUser);

        return () => {
            socket.off('room-created', enterRoom);
            socket.on('get-users', newUserJoined);
            socket.on('user-left', removeUser);
        }
    }, []);

    useEffect(() => {
        if(!stream) return;
        if(!me) return;

        socket.on('user-joined', ({ peerId }: { roomId: string, peerId: string}) => {
            console.log("user has jined the call");
            const call = stream && me?.call(peerId, stream);

            call.on('stream', (videoStream: MediaStream) => {
                dispatch(addPeerAction(peerId,videoStream));
            })
        })

        me.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (videoStream) => {
                dispatch(addPeerAction(call.peer,videoStream));
            })
        })
    }, [stream, me])

    return (
        <RoomContext.Provider value={{
            socket: socket,
            me: me,
            peers: peers,
            stream: stream
        }}>
            { children }
        </RoomContext.Provider>
    )
}