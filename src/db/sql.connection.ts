import mysql from 'mysql2';
import { config } from './sql.config';



const pool = mysql.createPool(config)



export default pool;
