import express from 'express'
import clubController from '../controllers/club.controller.js'

const router = express.Router();

router.route('/api/clubs')
	.get(clubController.list)
	.post(clubController.create)

router.route('/api/clubs/:clubId')
	.get(clubController.read)
	.put(clubController.update)
	.delete(clubController.remove)

router.param('clubId', clubController.clubByID);

export default router
