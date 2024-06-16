// src/Particles.js
import React, { useEffect, useRef, useState } from 'react';
import './Particles.css';


function initializeParticles(canvas) {
  // Your existing JavaScript logic goes here
  // Adjust the DOM manipulations and global variables accordingly

  class PixelDrawer {
    constructor(image) {
      this.image = image;
    }

    putPixel(x, y, r, g, b, a) {
      const ix = Math.round(x);
      const iy = Math.round(y);
      if (ix < 0 || ix >= this.image.width || iy < 0 || iy >= this.image.height) {
        return;
      }
      const index = iy * (4 * this.image.width) + 4 * ix;
      this.image.data[index] = r;
      this.image.data[index + 1] = g;
      this.image.data[index + 2] = b;
      this.image.data[index + 3] = a;
    }

    drawLine(x1, y1, x2, y2, r, g, b, a) {
      // ... (existing code)
    }
  }

  // Other classes like Vector3D, Particle, etc.

  class Canvas {
    constructor(canvas) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Invalid canvas element");
      }
      this.elem = canvas;
      this.context2d = canvas.getContext("2d");
      this.width = canvas.width;
      this.height = canvas.height;
    }

    createFrame() {
      const frame = this.context2d.createImageData(this.width, this.height);
      return new PixelDrawer(frame);
    }

    drawFrame(frame) {
      this.context2d.putImageData(frame.image, 0, 0);
    }
  }

  // Instantiate classes and initialize particles
  const canvasElem = canvas;
  const canvasInstance = new Canvas(canvasElem);

  // Initialize particles and animation logic
  const particles = []; // Create and manage particles

  function animate() {
    // Animation logic
    requestAnimationFrame(animate);
  }

  animate();
}

const Particles = () => {
  const canvasRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [particlesCount, setParticlesCount] = useState(0);
  const [performance, setPerformance] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      initializeParticles(canvasRef.current);
    }
  }, []);

  const toggleRun = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="container">
      <canvas ref={canvasRef} id="cnv" width="1100px" height="800"></canvas>
      <section className="data-section">
        <div className="date-value">
          <label>Scale factor</label>
          <input
            id="scaleFactorInp"
            type="range"
            min="0.001"
            max="20"
            step="0.01"
            value={scaleFactor}
            onChange={(e) => setScaleFactor(e.target.value)}
          />
          <span id="scalefactor">{scaleFactor}</span>
        </div>
        <div className="date-value">
          <label>Particles</label>
          <span id="particlescount">{particlesCount}</span>
        </div>
        <div className="date-value">
          <label>Performance</label>
          <span id="perfvalue">{performance}</span>
        </div>
        <div className="date-value">
          <label>Rotate X</label>
          <input
            id="xRotationInp"
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={rotationX}
            onChange={(e) => setRotationX(e.target.value)}
          />
          <span id="xrotate">{rotationX}</span>
        </div>
        <div className="date-value">
          <label>Rotate Y</label>
          <input
            id="yRotationInp"
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={rotationY}
            onChange={(e) => setRotationY(e.target.value)}
          />
          <span id="yrotate">{rotationY}</span>
        </div>
        <div className="date-value">
          <label>Rotate Z</label>
          <input
            id="zRotationInp"
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={rotationZ}
            onChange={(e) => setRotationZ(e.target.value)}
          />
          <span id="zrotate">{rotationZ}</span>
        </div>
        <div>
          <button id="toggleRunBtn" type="button" onClick={toggleRun}>
            {isRunning ? 'Pause' : 'Run'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Particles;
