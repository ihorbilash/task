import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const { HOST, BD_USERNAME, PASSWORD, DATABASE } = process.env;
export const config = {

    host: HOST,
    user: BD_USERNAME,
    password: PASSWORD,
    database: DATABASE,
    port: 3306,
    multipleStatements: true
} 