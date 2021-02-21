const express = require('express');
const router = express.Router();
const Contacts = require('../../model/index');
const validate = require('./validation');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();

    return res.json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact was found',
        data: { contact },
      });
    } else {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', validate.addContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);

    if (contact) {
      return res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Contact was created',
        data: { contact },
      });
    } else {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Contact already exists',
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact deleted',
        data: { contact },
      });
    } else {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId', validate.updateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );

    if (JSON.stringify(req.body) === '{}') {
      return res
        .status(400)
        .json({ status: 'error', code: 400, message: 'Missing fields' });
    }

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact was updated',
        data: { contact },
      });
    } else {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
