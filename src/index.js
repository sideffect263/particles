import { Vector } from './Vector.js';
import { Box } from './Box.js';
import { MainView } from './MainView.js';
import { initStars } from './demos/stars.js';
import { initGalaxies } from './demos/galaxies.js';
import { initPlanetarySystem } from './demos/planetary.js';
import { initGas } from './demos/gas.js';
import { initParticles } from './demos/particles.js';
import { initVelocityTest } from './demos/velocity.js';


class MaxVelocityDemo {
    getProps() {
        return { useField: false };
    }

    init(view) {
        const frame = view.canvas.createFrame();
        const { height } = view.canvas;

        const yF = (y) => height - y;

        const MAX_SPEED = 300;
        const scaleFactor = 3;
        const c = MAX_SPEED / scaleFactor;
        const relVelocity = (velocity) => c * Math.tanh(velocity / c);

        for (let x = 0; x < 1000; x += 1) {
            const v = x;
            frame.putPixel(x, yF(v), 128, 255, 128, 255);
            frame.putPixel(x, yF(c), 128, 255, 128, 255);
            const y = relVelocity(v);
            frame.putPixel(x, yF(y), 255, 128, 80, 255);
        }

        view.canvas.drawFrame(frame);
    }
}

class Box3dDemo {
    getProps() {
        return { useField: false };
    }

    init(view) {
        const { canvas } = view;

        const DIST = 1000; /* Distance from camera to canvas */
        const Z_SHIFT = 0; /* Distance from canvas to z=0 plane */
        const HH = canvas.height / 2;
        const HW = canvas.width / 2;

        const projectToScreen = (vector) => {
            const zDist = DIST + vector.z + Z_SHIFT;
            return {
                x: HW - (DIST * (HW - vector.x)) / zDist,
                y: HH - (DIST * (HH - vector.y)) / zDist,
                z: vector.z,
            };
        };

        const CUBE_X = 500;
        const CUBE_Y = 100;
        const CUBE_Z = 200;
        const CUBE_WIDTH = 400;
        const CUBE_HEIGHT = 100;
        const CUBE_DEPTH = 100;

        const cube = new Box(CUBE_WIDTH, CUBE_HEIGHT, CUBE_DEPTH);

        const cubeCenter = new Vector(
            CUBE_X + CUBE_WIDTH / 2,
            CUBE_Y + CUBE_HEIGHT / 2,
            CUBE_Z + CUBE_DEPTH / 2,
        );

        const draw3dFrame = () => {
            const frame = canvas.createFrame();

            cube.draw(frame, cubeCenter, projectToScreen);

            canvas.drawFrame(frame);
        };

        const update3dFrame = () => {
            cube.rotate(0, 0.1, 0);
            draw3dFrame();
            setTimeout(() => update3dFrame(), 100);
        };

        draw3dFrame();
        setTimeout(() => update3dFrame(), 100);
    }
}

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

const demoType = 'field';
const runCanvasDemo = 'maxVelocity';
const runFieldDemo = 'galaxies';

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
