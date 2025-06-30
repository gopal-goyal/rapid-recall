import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/context/SocketContext";

export default function useCheckRoomExists(roomId) {
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleResponse = ({ exists }) => {
      if (!exists) {
        alert("Room not found. Redirecting to homepage...");
        navigate("/");
      }
    };

    socket.emit("check-room-exists", { roomId });
    socket.on("room-exists-response", handleResponse);

    return () => {
      socket.off("room-exists-response", handleResponse);
    };
  }, [socket, roomId, navigate]);
}
