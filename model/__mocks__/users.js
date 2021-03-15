const { users } = require('./data');
const bcrypt = require('bcryptjs');

const findByEmail = jest.fn(email => {
  const [user] = users.filter(el => String(el.email) === String(email));
  return user;
});

const findById = jest.fn(id => {
  const [user] = users.filter(el => String(el._id) === String(id));
  return user;
});

const create = jest.fn(
  ({ name = 'Guest', email, password, sex = 'f', subscription = 'free' }) => {
    const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    const newUser = {
      name,
      email,
      password: pass,
      sex,
      subscription,
      _id: '604780b0a33f593b5866d7ad',
      validPassword: function (pass) {
        return bcrypt.compareSync(pass, this.password);
      },
    };
    users.push(newUser);
    return newUser;
  },
);

const updateToken = jest.fn((id, token) => {
  return {};
});

const updateUserSub = jest.fn((id, subscription) => {
  const [user] = users.filter(el => String(el._id) === String(id));
  if (user) {
    user.subscription = subscription;
    return user;
  }
  return {};
});

const updateAvatar = jest.fn((id, avatarURL) => {
  const [user] = users.filter(el => String(el._id) === String(id));
  if (user) {
    user.avatarURL = avatarURL;
    return user.avatarURL;
  }
  return {};
});

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateAvatar,
  updateUserSub,
};
