const app = require('../app');
const db = require('../model/db');
const createFolderIsExist = require('../helpers/create-dir');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOADS_DIR = process.env.UPLOADS_DIR;
    const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
    await createFolderIsExist(UPLOADS_DIR);
    await createFolderIsExist(AVATARS_OF_USERS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server not running with error ${err.message}`);
  process.exit(1);
});
