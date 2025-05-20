import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'en-US';
      recog.onresult = e => {
        const transcript = e.results[0][0].transcript;
        handleSend(transcript);
      };
      recognitionRef.current = recog;
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      const video = document.getElementById('webcam');
      if (video) video.srcObject = stream;
    }).catch(() => {});
  }, []);

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
      uttr.lang = 'en-US';
      window.speechSynthesis.speak(uttr);
    } catch (err) {
      console.error(err);
    }
  };

  const startVoice = () => {
    recognitionRef.current && recognitionRef.current.start();
  };

  return (
    <div className="dexter-container">
      <h1>Dexter</h1>
      <div id="webcam-wrapper">
        <video id="webcam" autoPlay muted width="320" height="240"></video>
      </div>
      <div className="chat">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.from}`}>{m.text}</div>
          ))}
        </div>
        <div className="input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(input); }}
            placeholder="Type your message" />
          <button onClick={() => handleSend(input)}>Send</button>
          <button onClick={startVoice}>Talk</button>
        </div>
      </div>
    </div>
  );
}
