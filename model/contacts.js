const Contact = require('./schemas/contact');

const listContacts = async userId => {
  try {
    const result = await Contact.find({ owner: userId }).populate({
      path: 'owner',
      select: 'name email -_id',
    });

    console.log(`${result.length} contacts was found.`);

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async (contactId, userId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({
      path: 'owner',
      select: 'name email -_id',
    });

    if (!result) {
      console.error(`There is no contact with id ${contactId}.`);
      return;
    }

    console.log(`Contact with id ${contactId} was found.`);

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async (contactId, userId) => {
  try {
    const result = await Contact.findByIdAndRemove({
      _id: contactId,
      owner: userId,
    });

    if (!result) {
      console.error(`There is no contact with id ${contactId}.`);
      return;
    }

    console.log(`Contact with id ${contactId} was deleted.`);

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async body => {
  try {
    const result = await Contact.create(body);

    console.log('New contact was added.');

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId },
      { ...body },
      { new: true },
    );

    if (!result) {
      console.error(`There is no contact with id ${contactId}.`);
      return;
    }

    console.log(`Contact with id ${contactId} was updated.`);

    return result;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
