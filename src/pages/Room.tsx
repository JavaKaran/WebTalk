import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";

const Room = () => {

    const { id } = useParams();
    const { socket, me, stream, peers } = useContext(RoomContext);

    useEffect(() => {
        me?.on('open', () => {
            socket.emit('join-room', { roomId: id, peerId: me._id });
        })
    }, [id, me, socket])

    return (
        <>
            <h1>Welcome</h1>
            <p>Room No - { id }</p>

            <div className="grid grid-cols-4 gap-4">
                <VideoPlayer stream={stream} />

                {Object.values(peers).map((peer: any) => {
                    // console.log("peer", peer);
                    return (
                    <VideoPlayer key={peer.stream.id} stream={peer.stream} />
                )})}
            </div>
        </>
    )
};

export default Room;