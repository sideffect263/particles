import { Canvas2D } from './Canvas2D.js';
import { CanvasWebGL } from './CanvasWebGL.js';
import { Field } from './Field.js';

const defaultProps = {
    autoStart: false,
    animationDelay: 10,
    initialScale: 0.1,
    timeStep: 0.1,
    scaleStep: 0,
    useField: true,
    useWebGL: true,
    demo: null,
    depth: 2000,
};

export class MainView {
    constructor(props) {
        this.props = {
            ...defaultProps,
            ...props,
        };

        if (this.props.demo && this.props.demo.getProps) {
            const props = this.props.demo.getProps();
            this.props = {
                ...this.props,
                ...props,
            };
        }

        this.scaleFactorElem = null;
        this.scaleFactorInp = null;
        this.countElem = null;
        this.perfElem = null;

        this.xRotationInp = null;
        this.xRotationText = null;

        this.yRotationInp = null;
        this.yRotationText = null;

        this.zRotationInp = null;
        this.zRotationText = null;

        this.toggleRunBtn = null;

        this.field = null;

        this.state = {
            paused: true,
            updating: false,
            rotating: false,
            rotation: { alpha: 0, beta: 0, gamma: 0 },
            timestamp: undefined,
            perfValue: 0,
        };

        // Instead of waiting for DOMContentLoaded, directly call init
        // if the script runs after the DOM is loaded.
        this.init();
    }

    init() {
        console.log('Initializing MainView...');
        const canvasElem = document.getElementById('cnv');
        if (!canvasElem) {
            console.error('Canvas element not found!');
            return;
        }

        if (this.props.useWebGL) {
            this.canvas = new CanvasWebGL(canvasElem);
            this.canvas.setMatrix(
                [canvasElem.clientWidth, canvasElem.clientHeight, this.props.depth],
                [canvasElem.clientWidth / 2, canvasElem.clientHeight / 2, 0],
                [this.state.rotation.alpha, this.state.rotation.beta, this.state.rotation.gamma],
                [1, 1, 1],
            );
        } else {
            this.canvas = new Canvas2D(canvasElem);
        }

        this.scaleFactorInp = document.getElementById('scaleFactorInp');
        this.scaleFactorElem = document.getElementById('scalefactor');
        this.countElem = document.getElementById('particlescount');
        this.perfElem = document.getElementById('perfvalue');

        this.xRotationInp = document.getElementById('xRotationInp');
        this.xRotationText = document.getElementById('xrotate');

        this.yRotationInp = document.getElementById('yRotationInp');
        this.yRotationText = document.getElementById('yrotate');

        this.zRotationInp = document.getElementById('zRotationInp');
        this.zRotationText = document.getElementById('zrotate');

        this.toggleRunBtn = document.getElementById('toggleRunBtn');

        if (this.props.useField) {
            this.scaleFactorInp.disabled = false;
            this.scaleFactorInp.addEventListener('input', (e) => this.onScale(e));

            this.xRotationInp.disabled = false;
            this.xRotationInp.addEventListener('input', (e) => this.onXRotate(e));

            this.yRotationInp.disabled = false;
            this.yRotationInp.addEventListener('input', (e) => this.onYRotate(e));

            this.zRotationInp.disabled = false;
            this.zRotationInp.addEventListener('input', (e) => this.onZRotate(e));

            this.toggleRunBtn.disabled = false;
            this.toggleRunBtn.addEventListener('click', () => this.onToggleRun());
        } else {
            this.scaleFactorInp.disabled = true;
            this.xRotationInp.disabled = true;
            this.yRotationInp.disabled = true;
            this.zRotationInp.disabled = true;
            this.toggleRunBtn.disabled = true;
        }

        this.start();
    }

    setScaleStep(step) {
        this.props.scaleStep = step;
    }

    start() {
        if (this.props.useField) {
            this.field = new Field(this.canvas, this.props.initialScale, this.props.timeStep);
        }

        if (this.props.demo) {
            if (this.props.demo.init) {
                this.props.demo.init(this);
            } else {
                this.props.demo(this);
            }
        }

        if (this.props.useField) {
            this.field.drawFrame();
        }

        this.render();

        if (this.props.useField && this.props.autoStart) {
            this.run();
        }
    }

    pause() {
        if (this.state.paused) {
            return;
        }

        this.state.paused = true;
        this.render();
    }

    run() {
        if (!this.state.paused) {
            return;
        }

        this.state.paused = false;
        this.render();
        requestAnimationFrame((t) => this.update(t));
    }

    onScale(e) {
        const val = parseFloat(e.target.value);

        this.field.setScaleFactor(val);
        this.render();
    }

    processRotation(a, b, g, pb) {
        this.state.rotating = true;

        if (this.state.updating) {
            setTimeout(() => this.processRotation(a, b, g, pb), 10);
            return;
        }

        if (this.props.useWebGL) {
            const canvasElem = this.canvas.elem;
            this.canvas.setMatrix(
                [canvasElem.clientWidth, canvasElem.clientHeight, this.props.depth],
                [canvasElem.clientWidth / 2, canvasElem.clientHeight / 2, 0],
                [this.state.rotation.alpha, this.state.rotation.beta, this.state.rotation.gamma],
                [1, 1, 1],
            );
        } else {
            this.field.rotate(a, b, g);
        }

        this.field.drawFrame();

        if (pb) {
            this.render();
        } else {
            this.run();
        }

        this.state.rotating = false;
    }

    onXRotate(e) {
        const pausedBefore = this.state.paused;
        this.pause();

        const val = parseFloat(e.target.value);
        const delta = val - this.state.rotation.alpha;
        this.state.rotation.alpha = val;

        this.processRotation(delta, 0, 0, pausedBefore);
    }

    onYRotate(e) {
        const pausedBefore = this.state.paused;
        this.pause();

        const val = parseFloat(e.target.value);
        const delta = val - this.state.rotation.beta;
        this.state.rotation.beta = val;

        this.processRotation(0, delta, 0, pausedBefore);
    }

    onZRotate(e) {
        const pausedBefore = this.state.paused;
        this.pause();

        const val = parseFloat(e.target.value);
        const delta = val - this.state.rotation.gamma;
        this.state.rotation.gamma = val;

        this.processRotation(0, 0, delta, pausedBefore);
    }

    onToggleRun() {
        if (this.state.paused) {
            this.run();
        } else {
            this.pause();
        }
    }

    update(timestamp) {
        if (this.state.rotating || this.state.paused) {
            return;
        }

        this.state.updating = true;

        const pBefore = performance.now();

        const dt = (this.state.timestamp) ? (timestamp - this.state.timestamp) : 0;
        this.state.timestamp = timestamp;

        this.field.calculate(dt);
        this.field.drawFrame();
        if (this.props.scaleStep !== 0) {
            this.field.setScaleFactor(this.field.scaleFactor + this.props.scaleStep);
        }

        this.state.perfValue = Math.round(performance.now() - pBefore);

        this.render();

        if (!this.state.paused) {
            requestAnimationFrame((t) => this.update(t));
        }

        this.state.updating = false;
    }

    render() {
        if (!this.props.useField) {
            return;
        }

        const sfText = this.field.scaleFactor.toFixed(3);
        const sfValue = parseFloat(sfText);

        this.scaleFactorElem.textContent = sfText;
        this.scaleFactorInp.value = sfValue;
        this.countElem.textContent = this.field.particles.length;
        this.perfElem.textContent = this.state.perfValue;

        this.toggleRunBtn.textContent = (this.state.paused) ? 'Run' : 'Pause';

        this.xRotationText.textContent = this.state.rotation.alpha.toFixed(2);
        this.yRotationText.textContent = this.state.rotation.beta.toFixed(2);
        this.zRotationText.textContent = this.state.rotation.gamma.toFixed(2);
    }
}

// After defining the class, call init directly if the script runs after DOM load.
new MainView({
    demo: null, // Adjust this as per your setup
});
