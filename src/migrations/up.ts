import  pool  from '../db/sql.connection'
import { readFileSync } from 'fs';

const file = readFileSync(__dirname + "/migration_up.sql","utf-8");

try {
    pool.query(file,err=>{
        if(err){
            console.log("problem to migration up =>",err)
        }else{
            console.log("migration=>up")
        }
        pool.end();
    });
} catch (e) {
    console.log("error migration=>",e)
}