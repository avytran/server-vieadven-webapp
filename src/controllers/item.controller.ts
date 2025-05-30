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
            logger.logError('getAllItemService', 'Internal Server Error', error, 500)
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message
            })
            return;
        }
    },
    getAllItems: async (req: Request, res: Response) => {
        try {
            const items = await itemService.getAllItems();
            console.log(items)

            if (!items) {
                logger.logWarning('getAllItemService', 'No item found', 404)
                res.status(404).json({
                    message: 'No item found',
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: items
            })
            return;
        } catch (error) {
            logger.logError('getAllItemService', 'Internal Server Error ' + error.message, error, 500)
            res.status(500).json({
                message: 'Internal Server Error' + " " + error.message
            })
        }
    },
    deleteItem: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const deletedItem = await itemService.deleteItem(id)


            if (!deletedItem) {
                logger.logWarning('deleteItemService', 'Not found', 404)
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.sendStatus(204);
            return;
        } catch (error) {
            logger.logError('deleteItemService', 'Internal Server Error ' + error.message, error, 500)
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    },
    deleteItems: async (req: Request, res: Response) => {
        try {
            const { item_ids } = req.body
            const deletedItem = await itemService.deleteItems(item_ids)

            if (!deletedItem) {
                logger.logWarning('deleteItemsService', 'Not found', 404)
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.sendStatus(204);
            return;
        } catch (error) {
            logger.logError('deleteItemsService', 'Internal Server Error ' + error.message, error, 500)
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    },
    updateItem: async (req: Request, res: Response) => {
        const { id } = req.params
        const item = req.body

        try {
            const updatedItem = await itemService.updateItem(id, item)

            if (!updatedItem) {
                logger.logWarning('updateItemService', 'Not found', 404)
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: updatedItem
            })
            return;
        } catch (error) {
            logger.logError('updateItemService', 'Internal Server Error ' + error.message, error, 500)
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    },
    getItemById: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const item = await itemService.getItemById(id)

            if (!item) {
                logger.logWarning('getItemService', 'Not found', 404)
                res.status(404).json({
                    message: 'Not found'
                })
                return;
            }

            res.status(200).json({
                message: 'Successfully',
                data: item
            })
            return;
        } catch (error) {
            logger.logError('getItemService', 'Internal Server Error ' + error.message, error, 500)
            res.status(500).json({
                message: 'Internal Server Error ' + error.message
            })
            return;
        }
    }
}