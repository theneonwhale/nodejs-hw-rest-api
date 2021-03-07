const Contact = require('./schemas/contact');

const getAllContacts = async (
  userId,
  { sortBy, sortByDesc, sub, filter, limit = '20', page = '1' },
) => {
  try {
    const data = await Contact.paginate(
      {
        owner: userId,
      },
      {
        limit,
        page,
        sort: {
          ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
          ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
        },
        select: filter ? filter.split('|').join(' ') : '',
        populate: {
          path: 'owner',
          select: 'name email -_id',
        },
      },
    );

    const { docs: contacts, totalDocs: total } = data;

    const result = {
      total: total.toString(),
      limit,
      page,
      contacts,
    };

    if (sub) {
      const filteredContacts = contacts.filter(
        contact => contact.subscription === sub,
      );
      result.total = filteredContacts.length.toString();
      result.contacts = filteredContacts;
      console.log(result.total);
    }

    console.log(`${result.total} contacts was found.`);

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
    const result = await Contact.findOneAndRemove({
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

const updateContact = async (contactId, body, userId) => {
  try {
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
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
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
