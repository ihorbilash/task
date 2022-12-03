import { Request, Response } from "express";

import { checkLogin, addUser, checkExistUser } from '../services/sql.service'


export async function login(req: Request, res: Response) {
    const { login, pass } = req.body
    const id: number = await checkLogin(login, pass);
    if (id) {
        req.session.Id = id;
        res.send({ "ok": true })
    } else {
        return res.status(400).json({ error: "not found" })
    }
}

export async function logout(req: Request, res: Response) {
    req.session.destroy;
    res.json({ "ok": true })
}


export async function register(req: Request, res: Response) {
    const { login, pass } = req.body
    const id: number | undefined = await checkExistUser(login)
    if (id) {
        res.status(400).json({ error: "bad request" })
    } else {
        const user_id = await addUser(login, pass);
        if (user_id)
            res.json({ "ok": true })
    }
}

