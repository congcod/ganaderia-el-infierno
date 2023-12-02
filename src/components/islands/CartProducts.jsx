'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { currencyFormatter } from '../../lib/currency-formatter'

const LazyPayPalButtons = lazy(() => import('./AppPayPalButtons'))

export default function CartProducts({ clientId }) {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const cartInStorage = window.localStorage.getItem('cart')

    if (cartInStorage) {
      const cartStored = JSON.parse(cartInStorage)
      setCart(cartStored)
    } else {
      setCart([])
    }
  }, [])

  return (
    <PayPalScriptProvider
      options={{
        'client-id': clientId,
        currency: 'MXN'
      }}
    >
      <div className='flex flex-row flex-nowrap justify-between items-start gap-6'>
        <section className='flex-1 flex flex-col gap-2'>
          {cart.map(({ product, quantity }) => (
            <article
              key={product.id}
              className='w-full flex flex-row justify-start gap-4 items-center bg-gray-100 py-2 px-4 shadow-sm rounded-md'
            >
              <figure>
                <img
                  src={product.image}
                  alt={product.name}
                  title={product.name}
                  className='w-40 aspect-[9/12] object-cover object-center'
                />
              </figure>

              <section className='flex-1'>
                <h3 className='text-xl font-medium text-slate-800 mb-1'>
                  {product.name}
                </h3>

                <p className='font-normal text-slate-900 mb-2'>
                  {product['short-description']}
                </p>

                <p className='text-lg font-bold mt-4 text-slate-700'>
                  <span className='font-medium text-slate-900'>Cantidad: </span>
                  {quantity}
                </p>

                <p className='text-lg font-bold text-slate-700'>
                  <span className='font-medium text-slate-900'>Precio: </span>
                  {currencyFormatter.format(product.price)}
                </p>

                <p className='text-lg font-bold text-slate-700'>
                  <span className='font-medium text-slate-900'>Total a pagar: </span>
                  {currencyFormatter.format(product.price * quantity)}
                </p>
              </section>
            </article>
          ))}
        </section>

        <section className='w-[30%] border border-slate-400 rounded-md'>
          <h3 className='p-2 border-b border-slate-400 text-2xl text-slate-800 text-center font-semibold'>
            Carrito de compras
          </h3>

          <section className='p-2 border-b border-slate-400'>
            <p className='text-lg font-semibold text-slate-700'>
              <span className='font-medium text-slate-900'>No. de productos: </span>
              {cart.length}
            </p>

            <p className='text-lg font-bold text-slate-700'>
              <span className='font-medium text-slate-900'>Total a pagar: </span>
              {currencyFormatter.format(
                cart.reduce((acc, { product, quantity }) => acc + (product.price * quantity), 0)
              )}
            </p>
          </section>

          <section className='p-2 pt-4'>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyPayPalButtons
                total={
                  cart
                    .reduce((acc, { product, quantity }) => acc + (product.price * quantity), 0)
                    .toString()
                }
                clearProducts={() => {
                  localStorage.removeItem('cart')
                  setCart([])
                }}
              />
            </Suspense>
          </section>
        </section>
      </div>
    </PayPalScriptProvider>
  )
}