import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState<boolean>(false);

    const handlePay = async () => {
        if (!stripe || !elements) return;

        setLoading(true);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:5173/success",
            },
        });

        if (result.error) {
            console.error(result.error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-lg p-6 space-y-6">

                {/* Header */}
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Complete your payment
                    </h2>
                    <p className="text-sm text-gray-600">
                        Total amount: <span className="font-medium text-gray-900">$67.00</span>
                    </p>
                </div>

                {/* Payment Form */}
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                    <PaymentElement />
                </div>

                {/* Pay Button */}
                <button
                    onClick={handlePay}
                    disabled={!stripe || loading}
                    className="
          w-full rounded-lg bg-blue-600 py-3 font-semibold text-white
          hover:bg-blue-700 active:bg-blue-800
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
                >
                    {loading ? "Processing payment…" : "Pay $67"}
                </button>

                {/* Footer reassurance */}
                <p className="text-xs text-gray-500 text-center">
                    🔒 Secure payment powered by Stripe
                </p>
            </div>
        </div>
    );
}

export default function Checkout() {
    const [clientSecret, setClientSecret] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:6767/api/create-payment-intent", {
            method: "POST",
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }, []);

    if (!clientSecret) return <p>Loading…</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
        </Elements>
    );
};
