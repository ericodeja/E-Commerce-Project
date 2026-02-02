import express from 'express'
import cartControllers from '../controllers/cartController.js'
import {authenticate, authorizePermissions} from '../middleware/auth.js'

const router = express.Router()



router.post('/',authenticate, authorizePermissions('cart:add'), cartControllers.addToCart)



export default router