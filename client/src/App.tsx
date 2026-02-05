import React from 'react';
import { evaluate } from 'mathjs';
import { useState } from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import Checkout from './components/Checkout';
import { stripePromise } from "./lib/stripe";

const App: React.FC = () => {

  const [input, setInput] = useState<string>("");
  const [head, setHead] = useState<string>("Calculator");

  const errorMsgs = [
    "nice try diddy.",
    "math says no.",
    "did you even try?",
    "blud, are you even trying?",
    "mate, i can't even.",
  ];

  const errorInputMsgs = [
    "use a number next time",
    "sybau",
    "even math is offended",
    "wtf",
    "what",
    "lmao"
  ];

  const [clientSecret, setClientSecret] = useState<string>();
  const [showCheckout, setShowCheckout] = useState<boolean>();

  const startPayment = async () => {
    const res = await axios.post('https://calculator-x4d7.onrender.com/api/create-payment-intent')
    setClientSecret(res.data.clientSecret);
    setShowCheckout(true);
  };

  const calculate = async () => {
    try {
      const result = evaluate(input);
      if (Number(result) === 67) {
        await startPayment();
        return
      }
      setInput(result.toString());
    } catch {
      const randomNumOne = Math.floor(Math.random() * errorInputMsgs.length);
      setInput(errorInputMsgs[randomNumOne]);
      const randomNumTwo = Math.floor(Math.random() * errorMsgs.length);
      setHead(errorMsgs[randomNumTwo]);
    }
  };

  const appendInput = (value: string) => {
    setInput(input + value);
    setHead("Calculator")
  };

  const buttonCss: string = 'border border-white/10 rounded-md bg-neutral-900 p-6 hover:scale-104 active:scale-90 active:bg-neutral-800 transition-all hover:bg-neutral-700 cursor-pointer';

  if (showCheckout && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <Checkout />
      </Elements>
    )
  }

  return (
    <div className='flex items-center justify-center h-screen flex-col bg-black gap-6 p-6' >
      <h1 className='text-white/80 font-bold text-4xl'>{head}</h1>
      <div className='grid grid-cols-4 text-2xl bg-neutral-950 font-bold gap-2 border max-w-md border-white/10 rounded-xl text-white/70 p-4'>
        <input type="text" value={input} className='col-span-4 bg-neutral-900 border border-white/10 outline-none rounded-md p-6 mb-2 text-3xl' />
        <button className='col-span-2 border border-white/10 rounded-md bg-neutral-900 hover:scale-104 active:scale-90 active:bg-neutral-800 transition-all hover:bg-neutral-700 cursor-pointer' onClick={() => setInput("")}>AC</button>
        <button className={buttonCss} onClick={() => setInput(input.slice(0, -1))}>DE</button>
        <button className={buttonCss} onClick={() => appendInput("/")}>/</button>
        <button className={buttonCss} onClick={() => appendInput("7")}>7</button>
        <button className={buttonCss} onClick={() => appendInput("8")}>8</button>
        <button className={buttonCss} onClick={() => appendInput("9")}>9</button>
        <button className={buttonCss} onClick={() => appendInput("*")}>x</button>
        <button className={buttonCss} onClick={() => appendInput("4")}>4</button>
        <button className={buttonCss} onClick={() => appendInput("5")}>5</button>
        <button className={buttonCss} onClick={() => appendInput("6")}>6</button>
        <button className={buttonCss} onClick={() => appendInput("-")}>-</button>
        <button className={buttonCss} onClick={() => appendInput("1")}>1</button>
        <button className={buttonCss} onClick={() => appendInput("2")}>2</button>
        <button className={buttonCss} onClick={() => appendInput("3")}>3</button>
        <button className={buttonCss} onClick={() => appendInput("+")}>+</button>
        <button className={buttonCss} onClick={() => appendInput(".")}>.</button>
        <button className={buttonCss} onClick={() => appendInput("0")}>0</button>
        <button className={buttonCss} onClick={() => appendInput("00")}>00</button>
        <button className={buttonCss} onClick={calculate}>=</button>
      </div>
    </div >
  );
};

export default App;