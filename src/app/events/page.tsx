import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';

export default async function EventsPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/'); 
  }

  const userTier = (user.publicMetadata?.tier as string) || 'free';

  const tierRank = ['free', 'silver', 'gold', 'platinum'];
  const allowedTiers = tierRank.slice(0, tierRank.indexOf(userTier) + 1);

  const currentTierIndex = tierRank.indexOf(userTier);
  const nextTier = currentTierIndex < tierRank.length - 1 ? tierRank[currentTierIndex + 1] : null;

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .in('tier', allowedTiers)
    .order('event_date', { ascending: true });

  if (error) {
    console.error("Error loading events:", error.message);
    return <div className="p-4 text-red-500">Error loading events</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">Your Events</h1>
            
            {nextTier && (
              <Link 
                href="/upgrade" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                Upgrade to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}
              </Link>
            )}
            
            {userTier === 'platinum' && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                <span>👑</span>
                Premium Member
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-zinc-800 px-3 py-1 rounded-full">
              Your tier: <span className={`font-semibold capitalize ${
                userTier === 'free' ? 'text-blue-400' :
                userTier === 'silver' ? 'text-gray-300' :
                userTier === 'gold' ? 'text-yellow-400' :
                'text-purple-400'
              }`}>{userTier}</span>
            </span>
            <span className="text-zinc-400">
              Showing events for: {allowedTiers.join(', ')}
            </span>
            
            {/* Show what they're missing */}
            {nextTier && (
              <span className="text-zinc-500 text-xs">
                Upgrade to unlock {tierRank.slice(currentTierIndex + 1).join(', ')} events
              </span>
            )}
          </div>
        </div>

        {events?.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No events available</h2>
            <p className="text-zinc-400 mb-4">No events found for your current tier.</p>
            
            {/* Upgrade suggestion when no events */}
            {nextTier && (
              <Link 
                href="/upgrade"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                Upgrade to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)} for More Events
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <div key={event.id} className="bg-zinc-800 rounded-lg p-6 shadow-lg hover:bg-zinc-750 transition">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.tier === 'free' ? 'bg-blue-600' :
                      event.tier === 'silver' ? 'bg-gray-400 text-black' :
                      event.tier === 'gold' ? 'bg-yellow-500 text-black' :
                      'bg-purple-600'
                    }`}>
                      {event.tier}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center text-sm text-zinc-400">
                  <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                  <span>🎫 {event.tier} tier</span>
                </div>
                
                {event.image_url && (
                  <div className="mt-4">
                    <img 
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}