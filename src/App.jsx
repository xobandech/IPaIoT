import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [str, setStr] = useState("");

  useEffect(() => {
    const newSocket = io("https://ipaskuska.azurewebsites.net");
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      //   socket.on("last_data", (data) => {
      //     console.log(data)
      //     setRfid(data.rfid);
      //     setData(data.dht);
      //   });
      // }
      socket.on("message", (str) => {
        console.log(str);
        setStr(str);
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("NEW STR - ", str)
  }, [str])
  return (
    <div >
      <h1>{str}</h1>
      <h1>Тестовый текст: {str}</h1>

    </div>
  );
}

export default App;
