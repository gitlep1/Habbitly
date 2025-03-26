import "./Dashboard.scss";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import * as TWEEN from "three/addons/libs/tween.module.js";

import dashboardCloudLogo from "../../../../assets/3D Objects/dashboard-cloud-logo.glb";

class EyeBall extends THREE.Mesh {
  constructor() {
    let geometry = new THREE.SphereGeometry(1, 64, 32).rotateX(Math.PI * 0.5);
    let material = new THREE.MeshLambertMaterial({
      onBeforeCompile: (shader) => {
        shader.uniforms.blink = this.parent.blink;
        shader.vertexShader = `
                  varying vec3 vPos;
                  ${shader.vertexShader}
              `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
                      vPos = position;
                  `
        );
        shader.fragmentShader = `
                  uniform float blink;
                  varying vec3 vPos;
                  ${shader.fragmentShader}
              `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `vec4 diffuseColor = vec4( diffuse, opacity );
                      
                      vec3 dir = vec3(0, 0, 1);
                      
                      vec3 nPos = normalize(vPos);
                      
                      float dotProduct = dot(dir, nPos);
                      
                      float iris = smoothstep(0.79, 0.8, dotProduct);
                      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0, 0, 1), iris);
                      
                      float pupil = smoothstep(0.96, 0.97, dotProduct);
                      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0), pupil);
                      
                      float blinkVal = sin(blink * PI);
                      nPos.y *= 250. * blinkVal;
                      float eyeLid = smoothstep(0.7, 0.75, dot(dir, normalize(nPos)));
                      diffuseColor.rgb = mix(diffuse, diffuseColor.rgb, eyeLid);
                      
                  `
        );
      },
    });
    super(geometry, material);
  }
}

class Eyes extends THREE.Group {
  constructor(camera) {
    super();
    this.camera = camera;

    this.plane = new THREE.Plane();
    this.planeNormal = new THREE.Vector3();
    this.planePoint = new THREE.Vector3();

    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.lookAt = new THREE.Vector3();

    this.clock = new THREE.Clock();

    this.blink = { value: 0 };

    this.eyes = new Array(2).fill().map((_, idx) => {
      let eye = new EyeBall();
      eye.position.set(idx < 1 ? -0.15 : 0.15, 0.025, 0.9);
      eye.scale.setScalar(0.13);
      this.add(eye);
      return eye;
    });

    document.addEventListener("pointermove", (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const anchor = document.querySelector(".three-container");
      const rect = anchor.getBoundingClientRect();

      const anchorX = rect.left + rect.width / 2;
      const anchorY = rect.top + rect.height / 2;

      const angleDeg = angle(anchorX, anchorY, mouseX, mouseY);

      // console.log(angleDeg);

      this.pointer.x = (mouseX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(mouseY / window.innerHeight) * 2 + 1;
    });

    const angle = (cx, cy, ex, ey) => {
      const dy = ey - cy;
      const dx = ex - cx;
      const rad = Math.atan2(dy, dx);
      const deg = (rad * 180) / Math.PI;
      return deg;
    };

    this.blinking();
  }

  blinking() {
    let duration = 500;
    let delay = Math.random() * 3000 + 2000;
    this.blink.value = 0;
    new TWEEN.Tween(this.blink)
      .to({ value: 1 }, duration)
      .delay(delay)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onComplete(() => {
        this.blinking();
      })
      .start();
  }

  update() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.getWorldDirection(this.planeNormal);

    const eyeWorldPosition = new THREE.Vector3();
    this.eyes[0].getWorldPosition(eyeWorldPosition);

    this.plane.setFromNormalAndCoplanarPoint(
      this.planeNormal,
      eyeWorldPosition
    );

    let tempLookAt = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.plane, tempLookAt);
    this.lookAt.lerp(tempLookAt, 0.5);

    this.lookAt.clamp(
      new THREE.Vector3(-10, -1000, 5),
      new THREE.Vector3(10, 1000, -5)
    );

    this.eyes.forEach((eye) => {
      eye.lookAt(this.lookAt);
    });
  }
}

export const Dashboard = () => {
  const threeContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const eyesRef = useRef(null);

  useEffect(() => {
    if (!threeContainerRef.current) {
      return;
    }

    if (!sceneRef.current) {
      sceneRef.current = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      const container = threeContainerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      rendererRef.current = renderer;
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const animate = () => {
        requestAnimationFrame(animate);
        if (rendererRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, camera);
          if (eyesRef.current) {
            eyesRef.current.update();
            TWEEN.update();
          }
        }
      };
      animate();

      const handleResize = () => {
        const width = threeContainerRef.current.clientWidth;
        const height = threeContainerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (rendererRef.current) {
          rendererRef.current.setSize(width, height);
        }
      };

      window.addEventListener("resize", handleResize);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      sceneRef.current.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(5, 5, 5);
      sceneRef.current.add(directionalLight);

      const loader = new GLTFLoader();
      loader.load(
        dashboardCloudLogo,
        (gltf) => {
          const model = gltf.scene;

          model.scale.set(2.5, 2.5, 2.5);

          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);

          gltf.scene.name = "dashboardCloudLogo";
          sceneRef.current.add(model);

          const eyes = new Eyes(camera);
          eyesRef.current = eyes;
          model.add(eyes);
        },
        undefined,
        (error) => {
          console.error("useEffect: Error loading model:", error);
        }
      );

      return () => {
        window.removeEventListener("resize", handleResize);

        if (sceneRef.current) {
          sceneRef.current.traverse((object) => {
            if (object.isMesh) {
              object.geometry.dispose();
              if (object.material.isMaterial) {
                object.material.dispose();
              }
            }
          });
        }

        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    }
  }, []);

  return (
    <section className="desktop-dashboard-container">
      <h1>Desktop Dashboard</h1>
      <div ref={threeContainerRef} className="dashboard-three-container"></div>
    </section>
  );
};
