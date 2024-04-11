import express, { NextFunction, Request, Response } from 'express';
import * as GptService from '../services/gptService';
const router = express.Router();

router.post('/sendMsg', async function (req: Request, res: Response) {
    console.log(`sendMsg`,req.body)
    const {content} = req.body

    const result = await GptService.sendMsg(content);
    // const result= {}
    res.status(200).json(result)
});


export default router;
