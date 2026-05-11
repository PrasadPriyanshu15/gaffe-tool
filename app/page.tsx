


//! main search bar
"use client";

import { useState } from "react";
import { games } from "./data/games";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl mb-6">Select Game</h1>

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search game..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 w-80 text-black rounded"
      />

      {/* RESULTS */}
      <div className="mt-4 w-80 bg-gray-800 rounded">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => router.push(game.path)}
            className="p-3 hover:bg-gray-700 cursor-pointer"
          >
            {game.name}
          </div>
        ))}
      </div>
    </main>
  );
}