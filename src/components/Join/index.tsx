import React, { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";

const Join: React.FC = () => {

    const { socket, me } = useContext(RoomContext);

    const joinRoom = () => {
        socket.emit('create-room', { peerId: me._id });
    }

    return (
        <button onClick={joinRoom} className="bg-sky-400 py-2 px-8 rounded-lg text-xl hover:bg-sky-600 text-white">Join room</button>
    )
}

export default Join;