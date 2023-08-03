const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const PORT = 5000;

const route = require("./route");

const { addUser, findUser } = require("./users");

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  socket.on("join", ({ name, room }) => {
    socket.join(room);

    const { user, isExist } = addUser({ name, room });
    console.log("addedUser", user);

    const userMessage = isExist
      ? `${user.name}, here you go again`
      : `Hey my love ${user.name}`;
    console.log("user message", userMessage);

    socket.emit("message", {
      data: { user: { name: "Admin" }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit("message", {
      data: {
        user: { name: "Admin" },
        message: `${user.name} has joined`,
      },
    });
  });

  socket.on("sendMessage", ({ message, params }) => {
    console.log("params", params);
    console.log("sending message");
    const user = findUser(params);
    console.log("sent message", message);
    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
