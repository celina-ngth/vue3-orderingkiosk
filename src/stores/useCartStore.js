import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
    total: 0,
    nbItemsInCart: 0,
  }),
  getters: {
    getTotal: (state) => {
      const calculateTotal = state.cart.reduce((total, item) => {
        return (total += item.amount)
      }, 0)

      state.total = calculateTotal
    },
    getQuantityInCart: (state) => {
      const nbItemsInCart = state.cart.reduce((nbItemsInCart, item) => {
        return (nbItemsInCart += item.quantity)
      }, 0)

      state.nbItemsInCart = nbItemsInCart
    },
  },
  actions: {
    async getCart() {
      try {
        const response = await fetch('http://localhost:3000/cart')
        this.cart = await response.json()

        this.getTotal
        this.getQuantityInCart
      } catch (error) {
        console.error('Error:', error)
      }
    },

    async addToCart(newProduct, quantity) {
      try {
        let amount = newProduct.price * quantity

        const existingProduct = this.cart.find(
          (product) => product.id === newProduct.id
        )

        if (existingProduct) {
          existingProduct.quantity += quantity
          existingProduct.amount += amount

          await fetch(`http://localhost:3000/cart/${existingProduct.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(existingProduct),
          })
        } else {
          newProduct.quantity = quantity
          newProduct.amount = amount
          this.cart.push(newProduct)

          await fetch('http://localhost:3000/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
          })
        }

        this.getTotal
        this.getQuantityInCart
      } catch {
        console.error('Error:', error)
      }
    },

    async removeFromCart(productId) {
      try {
        await fetch(`http://localhost:3000/cart/${productId}`, {
          method: 'DELETE',
        })

        this.getCart()
      } catch {
        console.error('Error:', error)
      }
    },
  },
})
