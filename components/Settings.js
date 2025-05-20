export default function Settings({ voice, setVoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 p-4 rounded space-y-4 w-80 text-left">
        <h2 className="text-xl font-bold text-cyan-300">Settings</h2>
        <label className="block text-sm">
          Voice language
          <select
            value={voice}
            onChange={e => setVoice(e.target.value)}
            className="ml-2 bg-black border border-cyan-300 text-cyan-300"
          >
            <option value="en-US">en-US</option>
            <option value="en-GB">en-GB</option>
          </select>
        </label>
        <button onClick={onClose} className="w-full py-2 bg-cyan-400 text-black rounded">Close</button>
      </div>
    </div>
  );
}
