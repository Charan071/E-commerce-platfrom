"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Check, Loader2, ShieldCheck, Undo2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

type CheckoutStep = 1 | 2 | 3;
type DeliveryMethod = "standard" | "express";
type PaymentMethod = "COD" | "UPI" | "CARD";

type ShippingForm = {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  saveAddress: boolean;
};

const initialShippingForm: ShippingForm = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  saveAddress: false,
};

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function StepMarker({
  active,
  complete,
  label,
  number,
}: {
  active: boolean;
  complete: boolean;
  label: string;
  number: number;
}) {
  return (
    <div className={`flex items-center gap-2 ${active || complete ? "text-primary" : "text-text-muted"}`}>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
          active || complete ? "bg-primary text-white" : "bg-gray-200 text-text-muted"
        }`}
      >
        {complete ? <Check className="h-3.5 w-3.5" /> : number}
      </span>
      <span className="hidden text-xs font-bold uppercase tracking-wide sm:inline">{label}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, isHydrated } = useCart();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [shipping, setShipping] = useState<ShippingForm>(initialShippingForm);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const paymentMethod: PaymentMethod = "COD";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const shippingCost = deliveryMethod === "express" ? 199 : 0;
  const total = cartTotal + shippingCost;
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  function updateShippingField<Key extends keyof ShippingForm>(field: Key, value: ShippingForm[Key]) {
    setShipping((current) => ({ ...current, [field]: value }));
  }

  function continueToPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function placeOrder() {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: shipping.fullName,
            email: shipping.email,
            phone: shipping.phone,
            line1: shipping.line1,
            line2: shipping.line2,
            city: shipping.city,
            state: shipping.state,
            pincode: shipping.pincode,
            country: "India",
          },
          saveAddress: shipping.saveAddress,
          shippingCost,
          discount: 0,
          paymentMethod,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? "Could not place the order.");
      }

      setOrderNumber(data.orderNumber ?? data.id);
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not place the order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm text-text-muted">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-primary">Cart</Link>
              <span>/</span>
              <span className="text-text">Checkout</span>
            </div>
            <h1 className="font-serif text-4xl text-text">Checkout</h1>
          </div>

          <div className="grid gap-3 border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div className="text-sm">
                <p className="font-bold">Secure Checkout</p>
                <p className="text-xs text-text-muted">Protected contact and order details.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Undo2 className="h-6 w-6 text-primary" />
              <div className="text-sm">
                <p className="font-bold">7 Day Returns</p>
                <p className="text-xs text-text-muted">Return eligible sarees within 7 days.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border border-primary/10 bg-primary/5 p-4">
          <StepMarker number={1} label="Shipping" active={step === 1} complete={step > 1} />
          <div className="h-px flex-1 bg-primary/20 mx-3" />
          <StepMarker number={2} label="Payment" active={step === 2} complete={step > 2} />
          <div className="h-px flex-1 bg-primary/20 mx-3" />
          <StepMarker number={3} label="Confirmation" active={step === 3} complete={false} />
        </div>

        {!isHydrated && (
          <div className="bg-white p-8 text-center text-sm text-text-muted shadow-sm">
            Loading checkout...
          </div>
        )}

        {isHydrated && cart.length === 0 && step !== 3 && (
          <div className="bg-white p-8 text-center shadow-sm">
            <h2 className="mb-3 font-serif text-2xl text-text">Your cart is empty</h2>
            <p className="mb-6 text-sm text-text-muted">
              Add a saree to your cart before starting checkout.
            </p>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-sm bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Shop Sarees
            </Link>
          </div>
        )}

        {isHydrated && (cart.length > 0 || step === 3) && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              {step === 1 && (
                <div className="bg-white p-6 shadow-sm md:p-8">
                  <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-text">
                        Shipping Details
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        Continue as a guest, or sign in to use your account addresses.
                      </p>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <Link href="/login?redirectTo=/checkout" className="font-medium text-primary hover:underline">
                        Sign In
                      </Link>
                      <Link href="/signup" className="font-medium text-primary hover:underline">
                        Create Account
                      </Link>
                    </div>
                  </div>

                  <form className="max-w-2xl space-y-4" onSubmit={continueToPayment}>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="fullName">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.fullName}
                        onChange={(event) => updateShippingField("fullName", event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="email">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.email}
                        onChange={(event) => updateShippingField("email", event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="phone">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.phone}
                        onChange={(event) => updateShippingField("phone", event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="line1">
                        Address line 1
                      </label>
                      <input
                        id="line1"
                        name="line1"
                        type="text"
                        autoComplete="address-line1"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.line1}
                        onChange={(event) => updateShippingField("line1", event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="line2">
                        Address line 2 <span className="font-normal text-text-muted">(optional)</span>
                      </label>
                      <input
                        id="line2"
                        name="line2"
                        type="text"
                        autoComplete="address-line2"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.line2}
                        onChange={(event) => updateShippingField("line2", event.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="city">
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.city}
                        onChange={(event) => updateShippingField("city", event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="state">
                        State
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        autoComplete="address-level1"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.state}
                        onChange={(event) => updateShippingField("state", event.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text" htmlFor="pincode">
                        PIN code
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                        value={shipping.pincode}
                        onChange={(event) => updateShippingField("pincode", event.target.value)}
                        required
                      />
                    </div>

                    <label className="flex items-start gap-3 pt-2 text-sm text-text-muted">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary"
                        checked={shipping.saveAddress}
                        onChange={(event) => updateShippingField("saveAddress", event.target.checked)}
                      />
                      Save this address to my account when signed in.
                    </label>

                    <div className="pt-4">
                      <Button type="submit" size="lg" className="w-full sm:w-auto">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-white p-6 shadow-sm md:p-8">
                    <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-text">
                      Delivery Method
                    </h2>
                    <fieldset className="space-y-3">
                      <legend className="sr-only">Choose delivery method</legend>
                      <label
                        className={`flex cursor-pointer items-center justify-between border p-4 ${
                          deliveryMethod === "standard" ? "border-primary bg-primary/5" : "border-gray-200"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={deliveryMethod === "standard"}
                            onChange={() => setDeliveryMethod("standard")}
                          />
                          <span>
                            <span className="block text-sm font-medium text-text">Standard delivery</span>
                            <span className="block text-xs text-text-muted">3 to 5 business days</span>
                          </span>
                        </span>
                        <span className="text-sm font-bold text-green-700">Free</span>
                      </label>
                      <label
                        className={`flex cursor-pointer items-center justify-between border p-4 ${
                          deliveryMethod === "express" ? "border-primary bg-primary/5" : "border-gray-200"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={deliveryMethod === "express"}
                            onChange={() => setDeliveryMethod("express")}
                          />
                          <span>
                            <span className="block text-sm font-medium text-text">Express delivery</span>
                            <span className="block text-xs text-text-muted">1 to 2 business days</span>
                          </span>
                        </span>
                        <span className="text-sm font-bold text-text">{formatCurrency(199)}</span>
                      </label>
                    </fieldset>
                  </div>

                  <div className="bg-white p-6 shadow-sm md:p-8">
                    <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-text">
                      Payment Method
                    </h2>
                    <fieldset className="space-y-3">
                      <legend className="sr-only">Choose payment method</legend>
                      <label className="flex cursor-pointer items-start gap-3 border border-primary bg-primary/5 p-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="mt-1"
                          defaultChecked
                        />
                        <span>
                          <span className="block text-sm font-medium text-text">Cash on Delivery</span>
                          <span className="block text-xs text-text-muted">Pay when the order arrives.</span>
                        </span>
                      </label>
                    </fieldset>

                    {error && (
                      <div className="mt-5 flex gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-primary"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shipping
                      </button>
                      <Button size="lg" className="w-full sm:w-auto" onClick={placeOrder} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Placing Order
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white px-6 py-14 text-center shadow-sm md:px-8">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Check className="h-10 w-10" />
                  </div>
                  <h2 className="mb-4 font-serif text-3xl text-text">Order Placed</h2>
                  <p className="mx-auto mb-2 max-w-md text-text-muted">
                    Thank you for shopping with AnavaSilks. Your order number is{" "}
                    <span className="font-semibold text-text">{orderNumber}</span>.
                  </p>
                  <p className="mx-auto mb-8 max-w-md text-sm text-text-muted">
                    We saved the order in the backend and the admin dashboard can process it.
                  </p>
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                      href="/shop"
                      className="inline-flex h-11 items-center justify-center rounded-sm bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/account/orders"
                      className="inline-flex h-11 items-center justify-center rounded-sm border border-primary px-6 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      View Orders
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {step !== 3 && (
              <aside className="bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
                <h3 className="mb-6 border-b border-gray-100 pb-4 text-sm font-bold uppercase tracking-wider text-text">
                  Order Summary
                </h3>

                <div className="mb-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-center gap-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-gray-100 bg-gray-50">
                        <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-medium text-text">{item.title}</h4>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-text">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-y border-gray-100 py-6 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-text">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span className="font-medium text-text">
                      {shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Tax</span>
                    <span className="font-medium text-text">Included</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-bold text-text">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                </div>

                <p className="mt-5 text-xs text-text-muted">
                  Product prices are inclusive of taxes. We will contact you if any delivery detail needs
                  confirmation.
                </p>
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
