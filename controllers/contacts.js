const Contacts = require('../model/contacts');
const { HttpCode } = require('../helpers/constants');

const get = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contacts.listContacts(userId);

    return res.json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(req.params.contactId, userId);

    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Contact was found',
        data: { contact },
      });
    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({
          status: 'error',
          code: HttpCode.NOT_FOUND,
          message: 'Not found',
        });
    }
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });

    if (contact) {
      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        message: 'Contact was created',
        data: { contact },
      });
    } else {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Contact already exists',
      });
    }
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(req.params.contactId, userId);

    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Contact deleted',
        data: { contact },
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

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId,
    );

    if (JSON.stringify(req.body) === '{}') {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({
          status: 'error',
          code: HttpCode.BAD_REQUEST,
          message: 'Missing fields',
        });
    }

    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Contact was updated',
        data: { contact },
      });
    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({
          status: 'error',
          code: HttpCode.NOT_FOUND,
          message: 'Not found',
        });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getById,
  create,
  remove,
  update,
};
