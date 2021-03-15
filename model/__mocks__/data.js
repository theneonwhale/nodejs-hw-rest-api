const contacts = [
  {
    _id: '6044c43fc7bb8a1ab85d2998',
    subscription: 'free',
    name: 'Thanos1',
    email: 'thanos1@heroes.com',
    phone: '(992) 000-9132',
    owner: '6044007162bbaf3f24e788gd',
  },
  {
    _id: '6044c456c7bb8a1ab85d2999',
    subscription: 'free',
    name: 'Dr. Strange1',
    email: 'strange1@heroes.com',
    phone: '(992) 000-9133',
    owner: '6044007162bbaf3f24e788gd',
  },
];

const newContact = {
  name: 'Pegasus',
  email: 'pegasus@gmail.com',
  phone: '(992) 022-2222',
  subscription: 'pro',
};

const User = {
  name: 'Guest',
  email: 'guest01@gmail.com',
  password: '$2a$08$bDBo2w6934LY9R9bUbmzROY5zf5gDugqbzpZceKdvajZ8XLIMR./.',
  sex: 'f',
  subscription: 'premium',
  avatarURL: '1615724560065629-default.jpg',
  imgIdCloud: null,
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGE2ZDcyYzFkNjVmMTVhODYzZjdjYiIsImlhdCI6MTYxNTY2MTk0MCwiZXhwIjoxNjE1NjY5MTQwfQ.B2iu2sRacXWdyZoGZQg1h_rWF9ZjhK11qoaeRLseBrY',
  _id: '604780b0a33f593b5866d70d',
};

const users = [];
users[0] = User;

const newUser = { email: 'test@test.com', password: '123456' };

module.exports = { contacts, newContact, User, users, newUser };
