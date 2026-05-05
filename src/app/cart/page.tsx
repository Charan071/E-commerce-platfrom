"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  const tax = cartTotal * 0.05; // Assuming 5% GST
  const grandTotal = cartTotal + tax;

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text">Cart</span>
        </div>

        <div className="text-center md:text-left mb-10 border-b border-gray-200 pb-4">
          <h1 className="text-4xl font-serif text-text inline-flex items-center gap-4">
            <span className="h-px w-12 bg-primary/30 md:hidden"></span>
            Your Shopping Cart
            <span className="h-px w-12 bg-primary/30 md:hidden"></span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm shadow-sm">
            <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
            <p className="text-text-muted mb-8">Looks like you haven&apos;t added any silk sarees to your cart yet.</p>
            <Link href="/collections">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="lg:w-2/3 bg-white rounded-sm shadow-sm">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-text-muted">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-5 flex gap-4">
                      <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                        <Image src={item.image} alt={item.title} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/product/${item.id}`} className="font-serif font-medium text-text hover:text-primary transition-colors line-clamp-2 mb-1">
                          {item.title}
                        </Link>
                        {item.color && item.color[0] && (
                          <p className="text-xs text-text-muted mb-1">Color: {item.color[0].name}</p>
                        )}
                        <p className="text-xs text-text-muted">Material: {item.material}</p>
                      </div>
                    </div>

                    {/* Price - Mobile */}
                    <div className="md:hidden flex justify-between items-center text-sm font-bold mt-2">
                       <span className="text-text-muted font-normal">Price:</span>
                       ₹{item.price.toLocaleString("en-IN")}
                    </div>

                    {/* Price - Desktop */}
                    <div className="hidden md:block col-span-2 text-center font-bold text-text text-sm">
                      ₹{item.price.toLocaleString("en-IN")}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center mt-2 md:mt-0">
                      <span className="md:hidden text-text-muted text-sm">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-sm h-10 w-24">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                          className="px-2 text-text-muted hover:text-primary transition-colors h-full flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="flex-grow text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, Math.min(item.stock, item.quantity + 1))}
                          className="px-2 text-text-muted hover:text-primary transition-colors h-full flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Total - Mobile */}
                    <div className="md:hidden flex justify-between items-center text-sm font-bold mt-2 pb-4 border-b border-gray-100">
                       <span className="text-text-muted font-normal">Total:</span>
                       ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>

                    {/* Total - Desktop */}
                    <div className="hidden md:block col-span-2 text-center font-bold text-text text-sm">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>

                    {/* Action */}
                    <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center">
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-red-400 hover:text-red-600 transition-colors p-2"
                        title="Remove Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h3>
                
                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-medium text-text">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Tax (GST 5%)</span>
                    <span className="font-medium text-text">₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-text">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="bg-green-50 text-green-700 text-xs py-2 px-3 rounded-sm mb-6 flex items-center gap-2 border border-green-100">
                  <span className="text-green-500">🔖</span>
                  You are saving ₹2,950 on this order
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button size="lg" className="w-full flex justify-between items-center">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                   <p className="text-xs text-text-muted mb-4 font-bold uppercase tracking-wider">We Accept</p>
                   <div className="flex justify-center gap-2">
                     <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-blue-800 border border-gray-200">VISA</div>
                     <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-red-500 border border-gray-200">MC</div>
                     <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-800 border border-gray-200">UPI</div>
                     <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-blue-500 border border-gray-200">RuPay</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
