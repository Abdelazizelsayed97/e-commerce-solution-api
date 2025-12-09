import DataLoader from "dataloader"
import { DataSource } from "typeorm"
import { Cart } from "../entities/cart.entity"
import { Injectable } from "@nestjs/common"

Injectable()
export const cartLoader = (dataSource: DataSource) => {
   return new DataLoader<string, Cart>(async (ids: string[]) => {
      const cart = await dataSource.getRepository(Cart).find({
         relations: {
            cartItems: true,
            orders: true,
            user: true,
         }
      })
      console.log("cart",cart)
      const mappedItems = cart.reduce((acc, cart) => {
         acc[cart.id] = cart
         return acc
      })
      return ids.map((id) => mappedItems[id])
   })
}