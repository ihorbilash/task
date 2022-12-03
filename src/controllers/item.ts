
import { Request, Response } from 'express';
import { getNames, addName, editRang, delItem, getNamesByRang, checkUserSortAndFillRang, editName } from '../services/sql.service';


export async function gets(req: Request, res: Response) {
    try {
        if (!req.session.Id) {
            res.status(400).json({ error: "forbidden" })
        } else {
            const user_id = req.session.Id;
            const data = await getNames() as ReturnNames[];
            await checkUserSortAndFillRang(user_id, data);
            let user = await getNamesByRang(user_id) as ReturnResultData[]
            res.json({ items: user })
        }
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function create(req: Request, res: Response) {

    try {
        const { name } = req.body
        let name_id = await addName(name)
        if (name_id)
            res.json({ id: name_id });
    } catch (e) {
        res.status(500).json(e);
    }

}

export async function updateRang(req: Request, res: Response) {
    try {
        const user_id = req.session.Id
        let { get_r, put_r } = req.body
        await editRang(user_id, get_r, put_r)
        res.json({ "ok": true })
    } catch (e) {
        res.status(500).json(e);
    }
}
export async function update(req: Request, res: Response) {
    console.log("edit=>", req.body)
    try {
        const { id, name } = req.body;
       await editName(id, name)
        res.json({ "ok": true })
    } catch (e) {
        res.status(500).json(e);
    }
}

export async function del(req: Request, res: Response) {
    try {
        const { id } = req.body
        await delItem(id)
        res.json({ "ok": true })
    } catch (e) {
        res.status(500).json(e);
    }
}

