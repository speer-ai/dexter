import { useEffect, useRef } from 'react';

const THREE_SRC = 'https://unpkg.com/three@0.152.2/build/three.min.js';

export default function Visualizer({ enabled, onLevel }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    let renderer, scene, camera, bars = [];
    let analyser, dataArray, audioCtx, source;
    let animationId;
    const mount = mountRef.current;
    if (!mount) return;

    const script = document.createElement('script');
    script.src = THREE_SRC;
    script.onload = init;
    document.head.appendChild(script);

    async function init() {
      const THREE = window.THREE;
      if (!THREE) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 50;
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      for (let i = 0; i < 64; i++) {
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = i - 32;
        bars.push(mesh);
        scene.add(mesh);
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 128;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        animate();
      } catch (err) {
        console.error(err);
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        bars.forEach((bar, i) => {
          const val = dataArray[i];
          sum += val;
          bar.scale.y = Math.max(0.1, val / 50);
        });
        const level = sum / dataArray.length / 255;
        onLevel && onLevel(level);
      }
      renderer && renderer.render(scene, camera);
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
      }
      if (audioCtx) audioCtx.close();
      mount.innerHTML = '';
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [enabled]);

  return <div ref={mountRef} className="w-full h-24 bg-black rounded"></div>;
}
