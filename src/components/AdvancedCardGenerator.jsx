import React, { useState } from "react";
import { FaCopy, FaDownload, FaRandom } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdvancedCardGenerator = () => {
  const [input, setInput] = useState({
    bin: "",
    month: "",
    year: "",
    cvv: "",
    count: 10
  });

  const [generatedCards, setGeneratedCards] = useState([]);

  // Helper: Luhn algorithm
  const luhnCheck = (num) => {
    let arr = (num + "").split("").reverse().map(x => parseInt(x));
    let lastDigit = arr.shift();
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
  };

  // Helper: Generate valid card number
  const generateRandomNumber = (bin, length) => {
    let cardNumber = bin;
    const neededDigits = length - bin.length - 1;
    for (let i = 0; i < neededDigits; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    let arr = (cardNumber + "0").split("").reverse().map(x => parseInt(x));
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    let checkDigit = (10 - (sum % 10)) % 10;
    return cardNumber + checkDigit;
  };

  // Generate card object
  const generateCard = () => {
    const { bin, month, year, cvv } = input;
    const cardLength = 16;
    const cardNumber = bin ? generateRandomNumber(bin, cardLength) : generateRandomNumber("4", cardLength);
    const expiryMonth = month || String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const expiryYear = year || String(new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).slice(-2);
    const cardCvv = cvv || String(Math.floor(Math.random() * 900) + 100);
    return {
      number: cardNumber,
      expiry: `${expiryMonth}/${expiryYear}`,
      cvv: cardCvv
    };
  };

  // Generate cards
  const generateCards = () => {
    toast.dismiss();
    const count = Math.min(Math.max(parseInt(input.count) || 10, 1), 100);
    const cards = [];
    for (let i = 0; i < count; i++) {
      let card;
      do {
        card = generateCard();
      } while (!luhnCheck(card.number));
      cards.push(card);
    }
    setGeneratedCards(cards);
    toast.success(`Generated ${count} valid cards!`);
  };

  // Copy single card
  const copyCard = (text) => {
    toast.dismiss();
    navigator.clipboard.writeText(text);
    toast.info("Card copied!");
  };

  // Copy all cards
  const copyAllCards = () => {
    toast.dismiss();
    const allCards = generatedCards.map(c => `${c.number}|${c.expiry.split("/")[0]}|20${c.expiry.split("/")[1]}|${c.cvv}`).join('\n');
    navigator.clipboard.writeText(allCards);
    toast.success("All cards copied!");
  };

  // Export to CSV
  const exportToCSV = () => {
    if (generatedCards.length === 0) {
      toast.warning("No cards to export!");
      return;
    }
    const headers = ["Card Number", "Expiry", "CVV"];
    const csvRows = [
      headers.join(","),
      ...generatedCards.map(card => [card.number, card.expiry, card.cvv].join(","))
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cards_export.csv";
    link.click();
    toast.success("Exported to CSV!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Advanced Card Generator By <Link to={"https://github.com/NazmulHasanNahin"} > NAHIN </Link></h1>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="bin"
            value={input.bin}
            onChange={handleInputChange}
            maxLength="6"
            className="p-3 rounded-md bg-gray-700 placeholder-gray-400"
            placeholder="BIN (optional)"
          />
          <input
            type="text"
            name="month"
            value={input.month}
            onChange={handleInputChange}
            maxLength="2"
            className="p-3 rounded-md bg-gray-700 placeholder-gray-400"
            placeholder="Expiry Month (MM)"
          />
          <input
            type="text"
            name="year"
            value={input.year}
            onChange={handleInputChange}
            maxLength="2"
            className="p-3 rounded-md bg-gray-700 placeholder-gray-400"
            placeholder="Expiry Year (YY)"
          />
          <input
            type="text"
            name="cvv"
            value={input.cvv}
            onChange={handleInputChange}
            maxLength="4"
            className="p-3 rounded-md bg-gray-700 placeholder-gray-400"
            placeholder="CVV"
          />
          <input
            type="number"
            name="count"
            value={input.count}
            onChange={handleInputChange}
            min="1"
            max="100"
            className="p-3 rounded-md bg-gray-700 placeholder-gray-400"
            placeholder="How many to generate (default 10)"
          />
        </div>

        <button
          onClick={generateCards}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md mb-6 flex items-center justify-center space-x-2"
        >
          <FaRandom />
          <span>Generate Cards</span>
        </button>

        {/* Actions */}
        {generatedCards.length > 0 && (
          <div className="flex justify-between mb-4">
            <button
              onClick={copyAllCards}
              className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded-md flex items-center space-x-2"
            >
              <FaCopy />
              <span>Copy All</span>
            </button>
            <button
              onClick={exportToCSV}
              className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-md flex items-center space-x-2"
            >
              <FaDownload />
              <span>Export CSV</span>
            </button>
          </div>
        )}

        {/* Cards Display */}
        {generatedCards.length > 0 && (
          <div className="space-y-4">
            {generatedCards.map((card, idx) => (
              <div key={idx} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-mono">{card.number}</div>
                  <div className="text-sm text-gray-400">Exp: {card.expiry} | CVV: {card.cvv}</div>
                </div>
                <button
                  onClick={() => copyCard(`${card.number}|${card.expiry.split("/")[0]}|20${card.expiry.split("/")[1]}|${card.cvv}`)}
                  className="text-blue-400 hover:text-blue-200"
                >
                  <FaCopy />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedCardGenerator;
