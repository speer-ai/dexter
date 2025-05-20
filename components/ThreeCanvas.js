import { useEffect, useRef } from 'react';

const THREE_SRC = 'https://unpkg.com/three@0.152.2/build/three.min.js';

export default function ThreeCanvas({ level }) {
  const mountRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const script = document.createElement('script');
    script.src = THREE_SRC;
    script.onload = init;
    document.head.appendChild(script);
    let renderer, scene, camera, frameId;

    function init() {
      const THREE = window.THREE;
      if (!THREE) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 4;
      const geometry = new THREE.IcosahedronGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
      const mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);
      animate();
    }
    function animate() {
      frameId = requestAnimationFrame(animate);
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      }
      renderer && renderer.render(scene, camera);
    }
    return () => {
      cancelAnimationFrame(frameId);
      mount.innerHTML = '';
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) {
      const s = 1 + level * 2;
      mesh.scale.set(s, s, s);
    }
  }, [level]);

  return <div ref={mountRef} className="w-full h-full"></div>;
}
