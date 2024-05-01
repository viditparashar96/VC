const express = require("express");
const http = require("http");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let connectedPeers = [];
io.on("connection", (socket) => {
  // console.log('a user connected',socket.id);
  connectedPeers.push(socket.id);
  console.log(connectedPeers);

  socket.on("pre-offer", (data) => {
    console.log("pre-offer-came");
    const { callType, calleePersonalCodeInput } = data;
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === calleePersonalCodeInput
    );
    if (connectedPeer) {
      const data = {
        callerSocketId: socket.id,
        callType,
      };
      io.to(calleePersonalCodeInput).emit("pre-offer", data);
    } else {
      const data = {
        preOfferAnswer: "CALLEE_NOT_FOUND",
      };
      io.to(socket.id).emit("pre-offer-answer", data);
    }
  });

  socket.on("pre-offer-answer", (data) => {
    console.log("pre-offer-answer-came", data);
    const { callerSocketId, preOfferAnswer } = data;
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === callerSocketId
    );
    if (connectedPeer) {
      io.to(callerSocketId).emit("pre-offer-answer", data);
    }
  });

  socket.on("webRTC-signaling", (data) => {
    console.log("webRTC-signaling came");
    const { connectedUserSocketId } = data;
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === connectedUserSocketId
    );
    if (connectedPeer) {
      io.to(connectedUserSocketId).emit("webRTC-signaling", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    connectedPeers = connectedPeers.filter(
      (peerSocketId) => peerSocketId !== socket.id
    );
    console.log(connectedPeers);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
