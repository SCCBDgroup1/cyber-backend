// const dotenv = require('dotenv');
import dotenv from 'dotenv';
dotenv.config();

export default{
    USERNAME: process.env.USERNAME || 'anywhere',
    PORT: process.env.PORT || 4000
}