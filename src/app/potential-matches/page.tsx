"use client"; // ✅ This tells Next.js it's a client component

import React, { useEffect, useState } from "react";

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
        (buyer.searchCriteria.condition === sellerBookPost.condition || buyer.searchCriteria.condition === "Any")
      );
    });
    setMatchedBuyers(matches);
  }, []);

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Potential Buyer Matches</h2>
      {matchedBuyers.length === 0 ? (
        <p className="text-gray-500">No buyers found matching your book post.</p>
      ) : (
        <ul className="space-y-4">
          {matchedBuyers.map((buyer) => (
            <li key={buyer.id} className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold">{buyer.name}</h3>
                <p className="text-gray-600">
                  Looking for: <strong>{buyer.searchCriteria.title}</strong> by {buyer.searchCriteria.author}
                </p>
              </div>
              <button
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
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
