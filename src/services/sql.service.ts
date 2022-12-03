import { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";

import pool from '../db/sql.connection'


async function sqlCommand(param: string) {
    return await new Promise((resolve, reject) => {
        pool.getConnection((err: Error, connection) => {
            connection.query(param, (err: Error, results: RowDataPacket[]) => {
                err ? reject(err) : resolve(results)
                connection.release();
            })
        })
    })
}


export async function checkLogin(login: string, pass: string) {
    const query = `SELECT u_id FROM users WHERE login=${login} AND password=${pass}`;
    const result = await sqlCommand(query) as RowDataPacket[];
    const id = result.length < 1 ? undefined : result[0].u_id;
    return id;
}
export async function checkExistUser(login: string) {
    const query = `SELECT u_id FROM users WHERE login=${login} `;
    const result = await sqlCommand(query) as RowDataPacket[];
    const id = result.length < 1 ? undefined : result[0].u_id;
    return id;
}

export async function addUser(login: string, pass: string) {
    const query = `INSERT INTO users (login,password) VALUES ('${login}','${pass}')`;
    const result = await sqlCommand(query) as ResultSetHeader;
    return result.insertId;
}

export async function getNames() {
    const command = `SELECT * FROM names`;
    return await sqlCommand(command);
}
async function getUserData(id: number) {
    const command = `SELECT * FROM users_names WHERE user_id=${id}`;
    return await sqlCommand(command);
}

export async function checkUserSortAndFillRang(u_id: number, data: ReturnNames[]) {
    let userData = await getUserData(u_id) as RelationData[]
    let command_1 = ''
    userData.sort((a, b) => { return a.rang - b.rang; })
    userData.forEach(({ user_id, rang }, index) => {
        if (rang !== index) {
            command_1 += `UPDATE users_names
            SET rang = ${index}
            WHERE user_id = ${user_id} AND rang = ${rang} ;\r\n `
        }
    })
    if (command_1 !== '') { await sqlCommand(command_1); }

    userData = await getUserData(u_id) as RelationData[]

    let counter = userData.length;
    let command = ''
    data.forEach(({ n_id }) => {
        let checker = false;
        userData.forEach(({ name_id }) => {
            if (n_id === name_id) { checker = true; }
        })
        if (!checker) {
            command += `INSERT INTO users_names (user_id,rang,name_id) values(${u_id},${counter},${n_id});\r\n `
            counter++;
        }
    })
    if (command !== '')
        await sqlCommand(command);

}

export async function getNamesByRang(id: number) {
    const command = `SELECT users_names.rang , names.name_field
    AS name,names.n_id FROM users_names
    LEFT JOIN names ON names.n_id = users_names.name_id
    WHERE users_names.user_id =${id}`
    let user = await sqlCommand(command) as ReturnResultData[]
    user.sort((a: { rang: number; }, b: { rang: number; }) => {
        return a.rang - b.rang;
    })
    return user;
}


export async function addName(name: string) {
    const comand = `INSERT INTO names (name_field) values ('${name}');`
    let result = await sqlCommand(comand) as ResultSetHeader;
    return result.insertId;
}

export async function editRang(user_id: number | unknown, get_r: string, put_r: string) {
    const command_1 = `UPDATE users_names
    SET rang = -1
    WHERE user_id = ${user_id} AND rang = ${get_r} ;
    UPDATE users_names
    SET rang = ${get_r}
    WHERE user_id = ${user_id} AND rang = ${put_r} ;
    UPDATE users_names
    SET rang = ${put_r}
    WHERE user_id = ${user_id} AND rang = -1 ;`;
    const command_2 = ` UPDATE users_names
    SET rang = -1
    WHERE user_id = ${user_id} AND rang = ${get_r} ;
    UPDATE users_names
    SET rang = rang + 1 WHERE user_id = ${user_id} AND rang >= ${put_r};
    UPDATE users_names
    SET rang = ${put_r} WHERE user_id = ${user_id} AND rang = -1 ;
    UPDATE users_names
    SET rang = rang - 1 
    WHERE user_id = ${user_id} AND rang > ${get_r} ; `;
    const queryCommand = Number(get_r) + 1 === Number(put_r) ? command_1 : command_2;
    await sqlCommand(queryCommand);

}
export async function editName(id: number, name: string) {
    const command = `UPDATE names SET name_field = '${name}' WHERE n_id = ${id}`;
    await sqlCommand(command);
}

export async function delItem(id: number) {
    const query = `DELETE FROM users_names WHERE name_id=${id};
    DELETE FROM names WHERE n_id = ${id};`
    await sqlCommand(query) as ResultSetHeader;


}








