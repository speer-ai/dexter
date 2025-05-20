export default function ChatSidebar({ messages, input, setInput, onSend, onTalk, micEnabled }) {
  return (
    <aside className="w-80 bg-gray-900 text-cyan-300 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-1 mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'user' ? 'text-white' : 'text-green-400'}>{m.text}</div>
        ))}
      </div>
      <input
        className="w-full p-2 bg-gray-800 border border-cyan-400 mb-2"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onSend(input); }}
        placeholder="Type your message"
      />
      <div className="flex gap-2">
        <button className="flex-1 bg-cyan-400 text-black py-2" onClick={() => onSend(input)}>Send</button>
        <button className="flex-1 bg-cyan-400 text-black py-2 disabled:opacity-50" onClick={onTalk} disabled={!micEnabled}>Talk</button>
      </div>
    </aside>
  );
}
