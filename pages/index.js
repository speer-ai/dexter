import { useEffect, useRef, useState } from 'react';
import Visualizer from '../components/Visualizer';
import Settings from '../components/Settings';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [voice, setVoice] = useState('en-US');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = voice;
      recog.onresult = e => {
        const transcript = e.results[0][0].transcript;
        handleSend(transcript);
      };
      recognitionRef.current = recog;
    }
    if (typeof navigator !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        const video = document.getElementById('webcam');
        if (video) video.srcObject = stream;
      }).catch(() => {});
    }
    // cleanup
    return () => {
      const video = document.getElementById('webcam');
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, [voice]);

  const handleSend = async (text) => {
    if (!text) return;
    setMessages(m => [...m, { from: 'user', text }]);
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }))
        })
      });
      const data = await res.json();
      const reply = data.reply;
      setMessages(m => [...m, { from: 'dexter', text: reply }]);
      const uttr = new SpeechSynthesisUtterance(reply);
      uttr.lang = voice;
      window.speechSynthesis.speak(uttr);
    } catch (err) {
      console.error(err);
    }
  };

  const startVoice = () => {
    recognitionRef.current && recognitionRef.current.start();
  };

  return (
    <div className="w-full max-w-xl mx-auto text-center space-y-4">
      <h1 className="text-3xl font-bold">Dexter</h1>
      <Visualizer />
      <div className="flex gap-4 justify-center">
        <video id="webcam" autoPlay muted width="320" height="240" className="rounded" />
        <Settings voice={voice} setVoice={setVoice} />
      </div>
      <div className="bg-black/50 p-4 rounded space-y-2">
        <div className="h-72 overflow-y-auto text-left space-y-1">
          {messages.map((m, i) => (
            <div key={i} className={m.from === 'user' ? 'text-white' : 'text-green-400'}>{m.text}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 bg-gray-900 border border-cyan-300 text-cyan-300"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(input); }}
            placeholder="Type your message"
          />
          <button className="px-3 py-2 bg-cyan-400 text-black" onClick={() => handleSend(input)}>Send</button>
          <button className="px-3 py-2 bg-cyan-400 text-black" onClick={startVoice}>Talk</button>
        </div>
      </div>
    </div>
  );
}
