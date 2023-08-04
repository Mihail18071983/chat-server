const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const PORT = 5000;

const route = require("./route");

const { addUser, findUser, getRoomUsers, removeUser } = require("./users");

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
    const userMessage = isExist
      ? `${user.name}, here you go again`
      : `Hey my love ${user.name}`;
    socket.emit("message", {
      data: { user: { name: "Admin" }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit("message", {
      data: {
        user: { name: "Admin" },
        message: `${user.name} has joined`,
      },
    });
    io.to(user.room).emit("room", {
      data: { users: getRoomUsers(user.room) },
    });
  });

  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);
    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  socket.on("leftRoom", ({ params }) => {
    const user = removeUser(params);
    if (user) {
      io.to(user.room).emit("message", {
        data: {
          user: { name: "Admin" },
          message: `${user.name} has left the room`,
        },
      });
      io.to(user.room).emit("room", {
        data: { users: getRoomUsers(user.room) },
      });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
