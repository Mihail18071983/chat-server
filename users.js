let users = [];

const trimStr = require("./utils");

const findUser = (user) => {
  if (!user) return;
  const userName = trimStr(user?.name || "");
  const userRoom = trimStr(user?.room || "");
  return users.find(
    (user) => trimStr(user.name) === userName && trimStr(user.room) === userRoom
  );
};

const getRoomUsers = (room) => users.filter((user) => user.room === room);

const addUser = (user) => {
  const isExist = findUser(user);
  !isExist && users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

const removeUser = (user) => {
  const foundUser = findUser(user);
  if (foundUser) {
    users = users.filter(
      ({ room, name }) => room === foundUser.room && name !== foundUser.name
    );
  }
  return foundUser;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };
