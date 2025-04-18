import { Request, Response } from 'express';

import itemService from '../services/item.service';
import { logger } from '../utils/log.util'

export default {
    createItem: async (req: Request, res: Response) => {
        try {
            const item = req.body
            const createdItem = await itemService.createItem(item);
            
            res.status(201).json({
                message: 'Successfully',
                data: createdItem
            })
            return;
        } catch (error) {
            logger.logError('itemService', 'Internal Server Error', error, 500)
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message
            })
            return;
        }
    }
}