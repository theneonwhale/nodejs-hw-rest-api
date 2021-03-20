const User = require('./schemas/user');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const findByVerificationToken = async verificationToken => {
  return await User.findOne({ verificationToken });
};

const create = async ({
  name,
  email,
  password,
  sex,
  subscription,
  verificationToken,
}) => {
  const user = new User({
    name,
    email,
    password,
    sex,
    subscription,
    verificationToken,
  });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateVerificationToken = async (id, verificationToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verificationToken });
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
  findByVerificationToken,
  create,
  updateToken,
  updateVerificationToken,
  updateUserSub,
  updateAvatar,
};
