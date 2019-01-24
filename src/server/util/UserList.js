exports.getUserListAsStringArray = (userListMap, getIds = false) => {
  let newUserList = [];
  userListMap.forEach((userInfo, id) => {
    if (getIds) {
      newUserList.push([id, userInfo.username]);
    } else {
      newUserList.push(userInfo.username);
    }
  });
  return newUserList;
};

exports.getFullUserList = userListMap => {
  let newUserList = [];
  userListMap.forEach((userInfo, id) => {
    newUserList.push({ id, userInfo });
  });
  return newUserList;
};

exports.getUserListThatClientCanUnderstand = (userListMap) => {
  /* User List: Array of {
      id: String id,
      username: String username,
      score: Number score,
      queue: Number queueOrder
    }*/
  let userListThatClientCanUnderstand = [];
  userListMap.forEach((userInfo, id) => {
    userListThatClientCanUnderstand.push({
      id,
      username: userInfo.username,
      score: userInfo.score,
      queue: userInfo.queue
    });
  });
  return userListThatClientCanUnderstand;
};
