export default function ChatSidebar({ messages, input, setInput, onSend, onTalk, micEnabled }) {
  const handleSubmit = e => {
    e.preventDefault();
    onSend(input);
  };

  return (
    <aside className="w-80 bg-gray-900/80 border-l border-cyan-700 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-1 mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'user' ? 'text-white' : 'text-green-400'}>{m.text}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          className="w-full p-2 bg-gray-800 border border-cyan-400 rounded resize-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={2}
          placeholder="Type your message"
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-cyan-400 text-black py-2 rounded">Send</button>
          <button type="button" className="flex-1 bg-cyan-400 text-black py-2 rounded disabled:opacity-50" onClick={onTalk} disabled={!micEnabled}>Talk</button>
        </div>
      </form>
    </aside>
  );
}
