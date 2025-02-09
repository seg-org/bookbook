"use client";  // ✅ This tells Next.js it's a client component

import React, { useState, useEffect } from "react";

// Mockup data for sellers' book posts
const sellerBookPost = {
  id: 1,
  title: "Clean Code",
  author: "Robert C. Martin",
  condition: "Good",
  tags: ["Programming", "Software Engineering"],
};

// Mockup data for potential buyers
const mockBuyerMatches = [
  {
    id: 101,
    name: "Alice Johnson",
    searchCriteria: {
      title: "Clean Code",
      author: "Robert C. Martin",
      condition: "Any",
    },
    interestedTags: ["Programming", "Software Engineering"],
  },
  {
    id: 102,
    name: "Bob Smith",
    searchCriteria: {
      title: "Refactoring",
      author: "Martin Fowler",
      condition: "New",
    },
    interestedTags: ["Software Design", "Programming"],
  },
  {
    id: 103,
    name: "Charlie Davis",
    searchCriteria: {
      title: "Clean Code",
      author: "Robert C. Martin",
      condition: "Good",
    },
    interestedTags: ["Software Engineering", "Coding"],
  },
];

const PotentialMatches: React.FC = () => {
  const [matchedBuyers, setMatchedBuyers] = useState<any[]>([]);

  useEffect(() => {
    // Filter buyers based on book match
    const matches = mockBuyerMatches.filter((buyer) => {
      return (
        buyer.searchCriteria.title === sellerBookPost.title &&
        (buyer.searchCriteria.condition === sellerBookPost.condition ||
          buyer.searchCriteria.condition === "Any")
      );
    });
    setMatchedBuyers(matches);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Potential Buyer Matches</h2>
      {matchedBuyers.length === 0 ? (
        <p className="text-gray-500">No buyers found matching your book post.</p>
      ) : (
        <ul className="space-y-4">
          {matchedBuyers.map((buyer) => (
            <li key={buyer.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{buyer.name}</h3>
                <p className="text-gray-600">
                  Looking for: <strong>{buyer.searchCriteria.title}</strong> by {buyer.searchCriteria.author}
                </p>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => alert(`Initiating chat with ${buyer.name}`)}
              >
                Chat
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PotentialMatches;