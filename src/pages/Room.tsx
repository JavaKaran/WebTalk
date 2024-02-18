import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

const Room = () => {

    const { id } = useParams();
    const { socket } = useContext(RoomContext);

    useEffect(() => {
        socket.emit('join-room', { roomId: id })
    }, [])

    return (
        <>
            <h1>Welcome</h1>
            <p>Room No - { id }</p>
        </>
    )
};

export default Room;