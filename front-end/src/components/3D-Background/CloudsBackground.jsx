import { useEffect, useRef, useContext } from "react";
import * as THREE from "three";

import { themeContext } from "../../CustomContexts/Contexts";

import { SetCookies } from "../../CustomFunctions/HandleCookies";

import Cloudo from "../../assets/images/BadCloud.png";

export default function CloudsBackground() {
  const mountRef = useRef(null);
  const { themeState } = useContext(themeContext);

  useEffect(() => {
    const currentRef = mountRef.current;
    if (!currentRef) {
      console.error("Mount reference not found.");
      return;
    }

    function isWebGLAvailable() {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"))
        );
      } catch (err) {
        return false;
      }
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    const isSupported = isWebGLAvailable();
    SetCookies("isWebGlSupported", isSupported, expirationDate);

    if (!isWebGLAvailable()) {
      console.warn("WebGL is not supported on this device.");
      return;
    }

    // === Scene Setup === \\
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      75, // Field of view (vertical, in degrees)
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      2000 // Far clipping plane (increased to see distant clouds)
    );
    camera.position.z = 5;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      console.error("WebGLRenderer initialization failed:", e);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    currentRef.appendChild(renderer.domElement);

    // === Lighting === \\
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    // === Cloud Particles === \\
    const cloudParticles = [];
    const loader = new THREE.TextureLoader();

    loader.load(
      Cloudo,
      (texture) => {
        const cloudGeo = new THREE.PlaneGeometry(10, 10); // size of the clouds Ex: 10 units wide by 10 units high

        const cloudMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true,
          opacity: themeState === "dark" ? 0.3 : 0.5,
          side: THREE.DoubleSide,
        });

        for (let i = 0; i < 20; i++) {
          const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);

          cloud.position.set(
            Math.random() * 100 - 50, // x position
            Math.random() * 40 - 20, // y position
            Math.random() * 60 - 50 // z position
          );

          cloud.rotation.z = Math.random() * 2 * Math.PI;
          cloudParticles.push(cloud);
          scene.add(cloud);
        }
      },
      undefined,
      (error) => {
        console.error("An error occurred loading the texture:", error);
      }
    );

    // === Animation Loop === \\
    const animate = () => {
      cloudParticles.forEach((p) => {
        p.rotation.z -= 0.0005;
        p.position.x += 0.01;
        if (p.position.x > 55) {
          p.position.x = -55;
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (currentRef && renderer.domElement) {
        currentRef.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      // Dispose Three.js resources to prevent memory leaks
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [themeState]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 overflow-hidden bg-transparent"
      style={{ pointerEvents: "none" }}
    />
  );
}
