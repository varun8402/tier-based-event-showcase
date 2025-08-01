import Link from 'next/link'
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const user = await currentUser()
  
  if (user) {
    redirect('/events')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">
          Welcome to the Tier-Based Event Showcase
        </h1>
        <h2 className="text-xl font-medium text-zinc-300">
          Explore the various participation tiers below:
        </h2>
        
        
        <ul className="w-full space-y-4">
          <li className="border-l-4 border-blue-500 bg-zinc-800 p-4 rounded-md shadow hover:scale-105 transition">
            <span className="text-blue-400 font-semibold">Free Tier</span>
            <p className="text-sm text-zinc-400">Basic access to free events.</p>
          </li>
          <li className="border-l-4 border-slate-300 bg-zinc-800 p-4 rounded-md shadow hover:scale-105 transition">
            <span className="text-slate-200 font-semibold">Silver Tier</span>
            <p className="text-sm text-zinc-400">Gets all the Silver tier perks and event showcase.</p>
          </li>
          <li className="border-l-4 border-yellow-400 bg-zinc-800 p-4 rounded-md shadow hover:scale-105 transition">
            <span className="text-yellow-300 font-semibold">Gold Tier</span>
            <p className="text-sm text-zinc-400">Access to premium gold tier and below tier events.</p>
          </li>
          <li className="border-l-4 border-purple-500 bg-zinc-800 p-4 rounded-md shadow hover:scale-105 transition">
            <span className="text-purple-400 font-semibold">Platinum Tier</span>
            <p className="text-sm text-zinc-400">All-access pass for platinum tier and all below tiers content.</p>
          </li>
        </ul>
        
        <p className="text-sm text-zinc-400 mt-4">
          Sign up to start with Free tier and explore events!
        </p>
      </div>
    </div>
  );
}