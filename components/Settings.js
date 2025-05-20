import { useState } from 'react';

export default function Settings({ voice, setVoice }) {
  return (
    <div className="bg-gray-900 p-3 rounded space-y-2 text-left">
      <h2 className="font-bold text-cyan-300">Settings</h2>
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
    </div>
  );
}
