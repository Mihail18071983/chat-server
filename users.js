let users = [];

const trimStr = require("./utils");

const findUser = (user) => {
  if (!user) return
  const userName = trimStr(user?.name || "");
  console.log("userName in findUser", user.name);
  const userRoom = trimStr(user?.room || "");
  console.log("userRoom in findUser", userRoom);
  return users.find(
    (user) => trimStr(user.name) === userName && trimStr(user.room) === userRoom
  );
};



const addUser = (user) => {
  const isExist = findUser(user);
  console.log("ExistedUser", isExist);
  !isExist && users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

module.exports = { addUser, findUser };
