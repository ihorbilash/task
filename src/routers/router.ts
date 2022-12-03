
import express from 'express';

import { gets, create, del, updateRang,update } from '../controllers/item';
import { login, logout, register } from '../controllers/user';
const router = express.Router();

router.post('/login',  login)
router.post('/register', register)
router.post('/logout', logout)

router.route('/items')
.get(gets)
.post(create)
.put(updateRang)
.delete(del)
.patch(update)

export default router;