
  // Usage in React component
  import React, { useEffect, useRef } from 'react';
  import './Particles.css';
  

const initializeParticles = (canvas) => {
    "use strict";
  
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
        const steep = Math.abs(x1 - x2) < Math.abs(y1 - y2);
        if (steep) {
          [x1, y1] = [y1, x1];
          [x2, y2] = [y2, x2];
        }
        if (x1 > x2) {
          [x1, x2] = [x2, x1];
          [y1, y2] = [y2, y1];
        }
        const dx = x2 - x1;
        const dy = Math.abs(y2 - y1);
        let error = dx / 2;
        const ystep = y1 < y2 ? 1 : -1;
        let y = y1;
        for (let x = x1; x <= x2; x++) {
          if (steep) {
            this.putPixel(y, x, r, g, b, a);
          } else {
            this.putPixel(x, y, r, g, b, a);
          }
          error -= dy;
          if (error < 0) {
            y += ystep;
            error += dx;
          }
        }
      }
    }
  
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
  
    class Vector3D {
      constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
  
      // Other methods for Vector3D
    }
  
    class Particle {
      constructor(x, y, z, charge, mass) {
        this.pos = new Vector3D(x, y, z);
        this.force = new Vector3D(0, 0, 0);
        this.velocity = new Vector3D(0, 0, 0);
        this.m = mass;
        this.charge = charge;
        this.r = 0;
        this.drawPath = false;
        this.path = [];
        this.color = { r: 255, g: 255, b: 255 };
        this.removed = false;
      }
  
      // Other methods for Particle
    }
  
    class ChargedParticle extends Particle {
      constructor(x, y, z, charge) {
        super(x, y, z, charge, 938);
        this.color = { r: 255, g: 136, b: 136 };
      }
    }
  
    class DarkParticle extends Particle {
      constructor(x, y, z, charge) {
        super(x, y, z, charge, 0.5);
        this.color = { r: 136, g: 136, b: 255 };
      }
    }
  
    class MassiveParticle extends Particle {
      constructor(x, y, z, mass = 5e5) {
        super(x, y, z, 0, mass);
        this.r = Math.log(mass);
        this.color = this.getColor(mass);
      }
  
      getColor(mass) {
        const logMass = Math.log(mass);
        return mass >= 1e9 ? { r: 255 - Math.round(logMass), g: 255 - Math.round(logMass / 2), b: 255 } : { r: 255, g: Math.round(10 * logMass), b: 0 };
      }
  
      setMass(mass) {
        super.setMass(mass);
        this.color = this.getColor(mass);
      }
    }
  
    function randomInRange(min = 0, max = 1) {
      const minValue = Math.min(min, max);
      const maxValue = Math.max(min, max);
      const range = Math.abs(maxValue - minValue);
      return range === 0 ? minValue : Math.random() * range + minValue;
    }
  
    const particles = [];
    const canvasInstance = new Canvas(canvas);
    
    // Add particles initialization logic here
    function createParticles() {
      for (let i = 0; i < 50; i++) {
        const x = randomInRange(-canvasInstance.width / 2, canvasInstance.width / 2);
        const y = randomInRange(-canvasInstance.height / 2, canvasInstance.height / 2);
        const z = randomInRange(-1000, 1000);
        const charge = Math.random() > 0.5 ? 1 : -1;
        const particle = new ChargedParticle(x, y, z, charge);
        particles.push(particle);
      }
    }
  
    function draw() {
      const frame = canvasInstance.createFrame();
      particles.forEach(particle => {
        frame.putPixel(particle.pos.x, particle.pos.y, particle.color.r, particle.color.g, particle.color.b, 255);
      });
      canvasInstance.drawFrame(frame);
    }
  
    function animate() {
      draw();
      requestAnimationFrame(animate);
    }
  
    createParticles();
    animate();
  };
  
  const Particles = () => {
    const canvasRef = useRef(null);
  
    useEffect(() => {
      if (canvasRef.current) {
        initializeParticles(canvasRef.current);
      }
    }, []);
  
    return (
      <div className="container">
        <canvas ref={canvasRef} id="cnv" width="1100" height="800"></canvas>
        <section className="data-section">
          {/* Controls go here */}
        </section>
      </div>
    );
  };
  
  export default Particles;
  