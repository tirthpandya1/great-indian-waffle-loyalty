const React = require('react');
const { createElement, useEffect, useState } = React;

const FallingWaffles = () => {
    const [waffles, setWaffles] = useState([]);

    useEffect(() => {
        // Create initial waffles
        const initialWaffles = [];
        for (let i = 0; i < 15; i++) {
            initialWaffles.push(createWaffle(i));
        }
        setWaffles(initialWaffles);

        // Add new waffles periodically
        const interval = setInterval(() => {
            setWaffles(prevWaffles => {
                // Remove waffles that have been falling for too long
                const filteredWaffles = prevWaffles.filter(waffle => 
                    Date.now() - waffle.createdAt < waffle.duration * 1000
                );
                
                // Add a new waffle
                return [...filteredWaffles, createWaffle(prevWaffles.length)];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    function createWaffle(id) {
        const size = Math.floor(Math.random() * 30) + 20; // 20-50px
        const left = Math.floor(Math.random() * 100); // 0-100%
        const duration = Math.floor(Math.random() * 10) + 8; // 8-18s
        const delay = Math.floor(Math.random() * 5); // 0-5s
        const rotation = Math.floor(Math.random() * 360); // 0-360deg
        const type = Math.random() > 0.5 ? 'round' : 'square';

        return {
            id,
            size,
            left,
            duration,
            delay,
            rotation,
            type,
            createdAt: Date.now()
        };
    }

    return createElement(
        'div', 
        { className: 'waffle-container' },
        waffles.map(waffle => {
            const style = {
                width: `${waffle.size}px`,
                height: `${waffle.size}px`,
                left: `${waffle.left}%`,
                animationDuration: `${waffle.duration}s`,
                animationDelay: `${waffle.delay}s`,
                transform: `rotate(${waffle.rotation}deg)`,
                backgroundImage: waffle.type === 'round' 
                    ? "url('/images/waffle-round.svg')" 
                    : "url('/images/waffle-square.svg')"
            };
            
            return createElement('div', {
                key: waffle.id,
                className: 'falling-waffle',
                style: style
            });
        })
    );
};

module.exports = { default: FallingWaffles };
