import express from 'express'
import cartControllers from '../controllers/cartController.js'
import {authenticate, authorizePermissions} from '../middleware/auth.js'

const router = express.Router()



router.post('/',authenticate, authorizePermissions('cart:add'), cartControllers.addToCart)

router.get('/',authenticate, authorizePermissions('cart:read_one'), cartControllers.getUserCart)

router.put('/',authenticate, authorizePermissions('cart:update_one'), cartControllers.updateUserCart)

router.delete('/:cartItemId',authenticate, authorizePermissions('cart:delete_item'), cartControllers.deleteCartItem)

router.delete('/',authenticate, authorizePermissions('cart:delete'), cartControllers.clearCart)





export default router