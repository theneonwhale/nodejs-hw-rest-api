const User = require('./schemas/user');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const create = async ({ name, email, password, sex, subscription }) => {
  const user = new User({ name, email, password, sex, subscription });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateUserSub = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

// const updateAvatar = async (id, avatarURL, imgIdCloud) => {
//   return await User.updateOne({ _id: id }, { avatarURL, imgIdCloud });
// };

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateUserSub,
  updateAvatar,
};
