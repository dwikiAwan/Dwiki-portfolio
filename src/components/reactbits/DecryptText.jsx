import { useState, useEffect } from 'react';

export default function DecryptText({ children, speed = 80, delay = 400 }) {
    // Inisialisasi awal langsung kosong tanpa perlu memanggil setState di dalam effect
    const [displayText, setDisplayText] = useState('');
    const targetText = children || '';

    useEffect(() => {
        const timeout = setTimeout(() => {
            let iteration = 0;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
            
            const interval = setInterval(() => {
                setDisplayText(
                    targetText
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) {
                                return targetText[index];
                            }
                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join('')
                );

                if (iteration >= targetText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, speed);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [targetText, speed, delay]);

    return (
        <span className="font-mono">
            {displayText}
        </span>
    );
}