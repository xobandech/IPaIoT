import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState({
    h: 0,
    t: 0,
    f: 0,
    hif: 0,
    hic: 0,
    tif: 0,
    light: 512,
  });
  const [rfid, setRfid] = useState([]);
  useEffect(() => {
    const newSocket = io("http://api.tcpa-cpc-dev.dt00.net:3001");
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);


  useEffect(() => {
    if (socket) {
      socket.on("project_data", (data) => {
        setData(data);
      });
      socket.on("project_lightLevel", (data) => {
        console.log("DATA - ", data);
        setData((prev) => ({ ...prev, light: data }));
      });
      socket.on("project_rfid", (dataa) => {
        setRfid(rfid => [...rfid, dataa]);
      });
      
      socket.on("project_lastData", (data) => {
        setRfid(data.rfid);
        setData(data.dht);
      });
    }
  }, [socket]);

  return (
    <div className="flex flex-col justify-between h-screen">
      <nav className="bg-white mb-4 flex w-full items-center justify-center text-xl">
        Humidity & Temperature & RFID Logs & Sun Sensor
      </nav>
      <div className="text-white [&>*]:my-20">
        {/* RFID Logs */}
        <div>
          <div className="flex justify-center flex-col items-center">
            <h1 className="text-2xl font-bold">RFID Logs</h1>
            {rfid.length > 0 &&
              rfid.map((item, index) => (
                <div className="flex [&>*]:px-10 text-white" key={index}>
                  <h3 className="text-2xl">
                    Status: {item.status ? "🟢" : "🔴"}
                  </h3>
                  <h3 className="text-xl">Key: {item.rfid}</h3>
                  <h3 className="text-xl">
                    User: {(item.user && item.user.Name) || "Anonymous"} At: {item.at}
                  </h3>
                </div>
              ))}
          </div>
        </div>

        {/* Light sensor */}
        <div>
          <h2 className="flex font-bold justify-center text-2xl ">
            Light Sensor data
          </h2>
          <div className="flex justify-around">
            <div>
              <h3 className=" bg-slate-500 p-3 px-5 text-black text-xl">
                Light: {data.light} - {data.light > 512 ? "☀️" : "🌑"}
              </h3>
            </div>
          </div>
        </div>

        {/* DHT */}
        <div className="flex flex-col justify-around text-white text-xl font-semibold">
          <h2 className="flex justify-center text-2xl">DHT Sensor data</h2>
          <div className="flex justify-around">
            <div>
              <h3>Humidity: {data.h}</h3>
            </div>
            <div>
              <h3>Temperature °C: {data.t}°</h3>
              <h3>Temperature °F: {data.f}°</h3>
            </div>
            <div>
              <h3>Heat Index °C: {data.hic}</h3>
              <h3>Heat Index °F: {data.hif}</h3>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              fetch("http://api.tcpa-cpc-dev.dt00.net/api/project/last", {
                method: "POST",
              })
                .then((res) => res.json())
                .then((data) => {
                  setRfid(data.rfid);
                  setData(data.dht);
                });
            }}
          >
            Get Last Data From Server
          </button>
        </div>
      </div>
      <footer className="text-xl font-bold py-2 flex items-center justify-center bg-[#333] text-white w-full">
        Oleksandr Shtefan & Mariia Paik
      </footer>
    </div>
  );
}

export default App;
