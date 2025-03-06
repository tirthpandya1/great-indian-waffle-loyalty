const React = require('react');
const { createElement, useEffect, useState } = React;

const FallingWaffles = () => {
    const [waffles, setWaffles] = useState([]);

    useEffect(() => {
        // Create initial columns
        const initialWaffles = [];
        for (let i = 0; i < 2; i++) { // Reduced from 3 to 2 columns
            initialWaffles.push(createWaffle(i));
        }
        setWaffles(initialWaffles);

        // Add new waffles periodically
        const interval = setInterval(() => {
            setWaffles(prevWaffles => {
                return prevWaffles.map((_, index) => createWaffle(index));
            });
        }, 4000); // Increased from 2000ms to 4000ms

        return () => clearInterval(interval);
    }, []);

    function createWaffle(id) {
        const size = Math.floor(Math.random() * 50) + 50; // Increased size
        const left = (id * 20) + Math.random() * 10; // Column positioning
        const type = Math.floor(Math.random() * 3); // Random type

        return {
            id,
            size,
            left,
            createdAt: Date.now()
        };
    }

    return createElement(
        'div', 
        { className: 'waffle-container', style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' } },
        waffles.map(waffle => {
            const style = {
                width: `${waffle.size}px`,
                height: `${waffle.size}px`,
                backgroundImage: waffle.type === 0 
                    ? "url('/images/waffle_1.png')" 
                    : waffle.type === 1 
                    ? "url('/images/shake.png')" 
                    : "url('/images/brownie.png')"
            };
            
            return createElement('div', {
                key: waffle.id,
                className: 'waffle-icon',
                style: style
            });
        })
    );
};

module.exports = { default: FallingWaffles };
