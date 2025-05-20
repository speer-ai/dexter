import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Visualizer from '../components/Visualizer';
import ThreeCanvas from '../components/ThreeCanvas';
import Settings from '../components/Settings';
import ConversationsSidebar from '../components/ConversationsSidebar';
import ChatSidebar from '../components/ChatSidebar';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [voice, setVoice] = useState('en-US');
  const [showSettings, setShowSettings] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [level, setLevel] = useState(0);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // setup speech recognition when mic enabled or voice changes
  useEffect(() => {
    if (!micEnabled) return;
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
  }, [voice, micEnabled]);

  // handle camera enable/disable
  useEffect(() => {
    const video = document.getElementById('webcam');
    if (!video) return;
    if (cameraEnabled && typeof navigator !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        streamRef.current = stream;
        video.srcObject = stream;
      }).catch(() => {});
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      video.srcObject = null;
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [cameraEnabled]);

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
    if (micEnabled && recognitionRef.current) recognitionRef.current.start();
  };

  return (
    <>
      <Head>
        <title>Dexter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="h-screen w-screen flex overflow-hidden text-cyan-300">
        <ConversationsSidebar conversations={[]} />
        <div className="flex-1 flex flex-col">
          <div className="flex justify-end gap-2 p-2 bg-gray-800">
            <button onClick={() => setCameraEnabled(v => !v)} className="px-3 py-1 bg-cyan-400 text-black rounded">
              {cameraEnabled ? 'Disable' : 'Enable'} Camera
            </button>
            <button onClick={() => setMicEnabled(v => !v)} className="px-3 py-1 bg-cyan-400 text-black rounded">
              {micEnabled ? 'Disable' : 'Enable'} Mic
            </button>
            <button onClick={() => setShowSettings(true)} className="px-3 py-1 bg-cyan-400 text-black rounded">
              Settings
            </button>
          </div>
          <div className="flex flex-1 overflow-hidden">
          <div className="w-64 p-4 flex flex-col items-center bg-gray-900/80 border-r border-cyan-700">
            <video id="webcam" autoPlay muted className={`w-full h-48 bg-gray-700 rounded mb-2 ${cameraEnabled ? '' : 'hidden'}`} />
            <Visualizer enabled={micEnabled} onLevel={setLevel} />
          </div>
          <div className="flex-1 flex items-center justify-center bg-black">
            <ThreeCanvas level={level} />
          </div>
          <ChatSidebar
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onTalk={startVoice}
            micEnabled={micEnabled}
          />
          </div>
        </div>
        {showSettings && (
          <Settings voice={voice} setVoice={setVoice} onClose={() => setShowSettings(false)} />
        )}
      </div>
    </>
  );
}
