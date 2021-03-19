const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const EmailService = require('../services/email');
const createFolderIsExist = require('../helpers/create-dir');

const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
// const { promisify } = require('util');
// const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// const uploadCloud = promisify(cloudinary.uploader.upload);

const register = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email is used',
      });
    }
    const verificationToken = uuidv4();
    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendEmail(verificationToken, email, name);
    const newUser = await Users.create({
      ...req.body,
      verify: false,
      verificationToken,
    });
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          name: newUser.name,
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Email or password is wrong',
      });
    }
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const getCurrentUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await Users.findById(id);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const updateUserSub = async (req, res, next) => {
  try {
    const id = req.user._id;

    await Users.updateUserSub(id, req.body.subscription);
    const user = await Users.findById(id);
    if (JSON.stringify(req.body) === '{}') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing fields',
      });
    }

    if (user) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Contact was updated',
        data: {
          name: user.name,
          email: user.email,
          subscription: user.subscription,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user._id;
    const avatarURL = await saveAvatarToStatic(req);
    await Users.updateAvatar(id, avatarURL);

    // const {
    //   public_id: imgIdCloud,
    //   secure_url: avatarUrl,
    // } = await saveAvatarToCloud(req);
    // await Users.updateAvatar(id, avatarUrl, imgIdCloud);

    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async req => {
  const id = req.user._id;
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);

  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id));
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar));

  const avatarURL = path.normalize(path.join(id, newNameAvatar));

  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarURL),
    );
  } catch (e) {
    console.log(e.message);
  }
  return avatarURL;
};

// const saveAvatarToCloud = async req => {
//   const pathFile = req.file.path;
//   const result = await uploadCloud(pathFile, {
//     public_id: req.user.imgIdCloud?.replace('Photo/', ''),
//     folder: 'Photo',
//     transformation: { width: 250, height: 250, crop: 'fill' },
//   });
//   // cloudinary.uploader.destroy(req.user.imgIdCloud, (err, result) => {
//   //   console.log(err, result);
//   // });
//   try {
//     await fs.unlink(pathFile);
//   } catch (e) {
//     console.log(e.message);
//   }
//   return result;
// };

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerificationToken(req.params.token);
    if (user) {
      await Users.updateVerificationToken(user.id, true, null);
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful!',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      data: 'Not found',
      message: 'User not found',
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateUserSub,
  avatars,
  verify,
};
