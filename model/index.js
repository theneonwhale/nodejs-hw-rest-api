const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, '.', 'contacts.json');

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(data);

    return contacts;
  } catch (error) {
    console.error(error.message);
  }
}

const listContacts = async () => {
  try {
    const contacts = await getContacts();

    console.table(`${contacts.length} contacts was found.`);
    console.table(contacts);

    return contacts;
  } catch (error) {
    console.error(error.message);
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await getContacts();
    const contact = contacts.find(({ id }) => id.toString() === contactId);

    if (!contact) {
      console.error(`There is no contact with id ${contactId}.`);
      return;
    }

    console.log(`Contact with id ${contactId} was found.`);

    return contact;
  } catch (error) {
    console.error(error.message);
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await getContacts();
    const contact = contacts.find(({ id }) => id.toString() === contactId);
    const contactsNew = contacts.filter(
      ({ id }) => id.toString() !== contactId,
    );

    if (!contact) {
      console.error(`There is no contact with id ${contactId}.`);
      return;
    }

    await fs.writeFile(
      contactsPath,
      JSON.stringify(contactsNew, null, 2),
      'utf8',
    );

    console.log(`Contact with id ${contactId} was deleted.`);

    return contact;
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await getContacts();

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      console.log(`Contact with name ${name} already exists.`);
      return;
    }

    if (contacts.find(contact => contact.email === email)) {
      console.log(`Contact with email ${email} already exists.`);
      return;
    }

    if (contacts.find(contact => contact.phone === phone)) {
      console.log(`Contact with phone ${phone} already exists.`);
      return;
    }

    const contactNew = { id: uuidv4(), name, email, phone };
    const contactsNew = [...contacts, contactNew];

    await fs.writeFile(
      contactsPath,
      JSON.stringify(contactsNew, null, 2),
      'utf8',
    );

    console.log('New contact was added.');

    return contactNew;
  } catch (error) {
    console.error(error.message);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await getContacts();
    const contact = contacts.find(({ id }) => id.toString() === contactId);

    if (!contact) {
      console.log(`There is no contact wit id ${contactId}.`);
      return;
    }

    if (
      body.name &&
      contacts.find(
        contact => contact.name.toLowerCase() === body.name.toLowerCase(),
      )
    ) {
      console.log(`Contact with name ${body.name} already exists.`);
      return;
    }

    if (body.email && contacts.find(contact => contact.email === body.email)) {
      console.log(`Contact with email ${body.email} already exists.`);
      return;
    }

    if (body.phone && contacts.find(contact => contact.phone === body.phone)) {
      console.log(`Contact with phone ${body.phone} already exists.`);
      return;
    }

    const contactIndex = contacts.indexOf(contact);

    contacts[contactIndex] = { ...contacts[contactIndex], ...body };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');

    console.log(`Contact with id ${contactId} was updated.`);

    return contacts[contactIndex];
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
