const dotenv = require('dotenv');
dotenv.config();

export default{
    USERNAME: process.env.USERNAME || 'anywhere',
    PORT: process.env.PORT || 4000
}