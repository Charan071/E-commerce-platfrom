"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShieldCheck, Undo2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + tax;

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
              <span>/</span>
              <span className="text-text">Checkout</span>
            </div>
            <h1 className="text-4xl font-serif text-text inline-flex items-center gap-4">
              Checkout
              <span className="h-px w-12 bg-primary/30"></span>
            </h1>
          </div>
          
          <div className="flex gap-8 border p-4 rounded-sm bg-white border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-red-600" />
              <div className="text-sm">
                <p className="font-bold">100% Secure Checkout</p>
                <p className="text-xs text-text-muted">Your information is safe with us.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Undo2 className="w-6 h-6 text-red-600" />
              <div className="text-sm">
                <p className="font-bold">7 Days Easy Returns</p>
                <p className="text-xs text-text-muted">Not satisfied? Return within 7 days.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Area */}
          <div className="lg:w-2/3">
            {/* Steps indicator */}
            <div className="flex justify-between items-center bg-primary/5 p-4 rounded-sm border border-primary/10 mb-8 font-medium text-sm">
               <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-text-muted'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    {step > 1 ? <Check className="w-3 h-3" /> : '1'}
                  </span>
                  Shipping Address
               </div>
               <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-text-muted'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    {step > 2 ? <Check className="w-3 h-3" /> : '2'}
                  </span>
                  Payment Method
               </div>
               <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-text-muted'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    3
                  </span>
                  Order Summary
               </div>
            </div>

            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text mb-6">SHIPPING ADDRESS</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text mb-2">Full Name*</label>
                      <input type="text" className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-2">Phone Number*</label>
                      <input type="tel" className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Enter your phone number" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-2">Email Address*</label>
                    <input type="email" className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Enter your email" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text mb-2">Address*</label>
                    <input type="text" className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="House no., Street, Area" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text mb-2">City*</label>
                      <input type="text" className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Enter your city" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text mb-2">State*</label>
                      <select className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white text-text-muted">
                        <option value="">Select State</option>
                        <option value="karnataka">Karnataka</option>
                        <option value="maharashtra">Maharashtra</option>
                        <option value="delhi">Delhi</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-xs font-bold text-text mb-2">PIN Code*</label>
                    <input type="text" className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Enter PIN code" required />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="save-address" className="w-4 h-4 text-primary rounded border-gray-300" />
                    <label htmlFor="save-address" className="text-sm text-text-muted cursor-pointer">Save this address for future use</label>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <Button type="submit" size="lg" className="w-full md:w-auto px-12">Continue to Payment</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-8">
                {/* Delivery Options */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm">
                   <h2 className="text-sm font-bold uppercase tracking-wider text-text mb-6">DELIVERY OPTIONS</h2>
                   <div className="space-y-4">
                     <label className="flex items-center justify-between p-4 border border-primary bg-primary/5 rounded-sm cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="delivery" defaultChecked className="w-4 h-4 text-primary" />
                          <div className="font-medium text-sm">Standard Delivery (3-5 Days)</div>
                        </div>
                        <div className="text-green-600 font-bold text-sm">FREE</div>
                     </label>
                     <label className="flex items-center justify-between p-4 border border-gray-200 hover:border-primary/50 rounded-sm cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="delivery" className="w-4 h-4 text-primary" />
                          <div className="font-medium text-sm text-text-muted">Express Delivery (1-2 Days)</div>
                        </div>
                        <div className="font-bold text-sm text-text">₹199</div>
                     </label>
                   </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm">
                   <h2 className="text-sm font-bold uppercase tracking-wider text-text mb-6">PAYMENT METHOD</h2>
                   <div className="space-y-4">
                     <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-primary" />
                          <div>
                             <div className={`font-medium text-sm ${paymentMethod === 'upi' ? 'text-text' : 'text-text-muted'}`}>UPI / QR</div>
                             <div className="text-xs text-text-muted mt-1">Pay using any UPI app</div>
                          </div>
                        </div>
                        <div className="font-bold text-sm italic text-gray-400">UPI Logo</div>
                     </label>
                     
                     <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-primary" />
                          <div>
                             <div className={`font-medium text-sm ${paymentMethod === 'card' ? 'text-text' : 'text-text-muted'}`}>Credit / Debit Card</div>
                             <div className="text-xs text-text-muted mt-1">Visa, MasterCard, Rupay</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                           <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1 rounded">VISA</span>
                           <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1 rounded">MC</span>
                        </div>
                     </label>

                     <label className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary" />
                          <div>
                             <div className={`font-medium text-sm ${paymentMethod === 'cod' ? 'text-text' : 'text-text-muted'}`}>Cash on Delivery</div>
                             <div className="text-xs text-text-muted mt-1">Pay when you receive</div>
                          </div>
                        </div>
                     </label>
                   </div>
                   
                   <div className="pt-8 flex justify-between items-center">
                     <button onClick={() => setStep(1)} className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
                       &larr; Back to Shipping
                     </button>
                     <Button size="lg" className="px-12" onClick={() => setStep(3)}>Review Order</Button>
                   </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation/Summary */}
            {step === 3 && (
              <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm text-center py-16">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                 </div>
                 <h2 className="text-3xl font-serif text-text mb-4">Order Placed Successfully!</h2>
                 <p className="text-text-muted mb-8 max-w-md mx-auto">
                   Thank you for shopping with AnavaSilks. Your order has been placed and is being processed. 
                   You will receive an email confirmation shortly.
                 </p>
                 <Link href="/">
                    <Button size="lg">Continue Shopping</Button>
                 </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar: Order Summary */}
          {step !== 3 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text mb-6 pb-4 border-b border-gray-100">
                  ORDER SUMMARY
                </h3>
                
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="flex gap-4 items-center">
                      <div className="relative w-16 h-20 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                        <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-serif font-medium line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-t border-gray-100 pt-6">
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

                {step === 2 && (
                  <Button size="lg" className="w-full flex justify-center items-center gap-2" onClick={() => setStep(3)}>
                    Place Order
                    <ShieldCheck className="w-4 h-4" />
                  </Button>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-text-muted">
                    By placing this order, you agree to our <Link href="#" className="underline hover:text-primary">Terms & Conditions</Link> & <Link href="#" className="underline hover:text-primary">Privacy Policy.</Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
