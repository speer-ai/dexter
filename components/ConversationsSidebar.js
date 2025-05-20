export default function ConversationsSidebar({ conversations = [] }) {
  return (
    <aside className="w-56 bg-gray-900 text-cyan-300 p-4 space-y-2 overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">Conversations</h2>
      {conversations.length === 0 && (
        <div className="text-sm text-gray-400">No conversations</div>
      )}
      {conversations.map((c, i) => (
        <div key={i} className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">
          {c.title}
        </div>
      ))}
    </aside>
  );
}
