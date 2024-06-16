import React from 'react';
import MainViewComponent from './MainViewComponent';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <MainViewComponent demoType="field" runCanvasDemo="maxVelocity" runFieldDemo="galaxies" />
        </div>
    );
};

export default App;
