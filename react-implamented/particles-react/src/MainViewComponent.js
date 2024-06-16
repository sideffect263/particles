import React, { useEffect, useRef } from 'react';
import { MainView } from './MainView ';
import { initStars } from './demos/stars.js';
import { initGalaxies } from './demos/galaxies.js';
import { initPlanetarySystem } from './demos/planetary.js';
import { initGas } from './demos/gas.js';
import { initParticles } from './demos/particles.js';
import { initVelocityTest } from './demos/velocity.js';
import { MaxVelocityDemo } from './demos/canvas/maxVelocity.js';
import { Box3dDemo } from './demos/canvas/box3d.js';

const canvasDemos = {
    maxVelocity: MaxVelocityDemo,
    cube: Box3dDemo,
};

const fieldDemos = {
    planetarySystem: initPlanetarySystem,
    stars: initStars,
    galaxies: initGalaxies,
    gas: initGas,
    particles: initParticles,
    velocityTest: initVelocityTest,
};

const MainViewComponent = ({ demoType, runCanvasDemo, runFieldDemo }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let demo;
        if (demoType === 'canvas') {
            const DemoClass = canvasDemos[runCanvasDemo];
            demo = new DemoClass();
        } else if (demoType === 'field') {
            demo = fieldDemos[runFieldDemo];
        }

        window.view = new MainView({
            demo,
        });
    }, [demoType, runCanvasDemo, runFieldDemo]);

    return (
        <div className="container">
            <canvas ref={canvasRef} id="mainCanvas" width="1100" height="800"></canvas>
        </div>
    );
};

export default MainViewComponent;
