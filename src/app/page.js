'use client';
import { useState } from 'react';

export default function Home() {
    const [scenario, setScenario] = useState('');
    const [loading, setLoading] = useState(false);

    const generateScenario = async () => {
        setLoading(true);
        setScenario('');

        try {
            const timestamp = Date.now();
            const response = await fetch(`/api/chat?t=${timestamp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: `You are an AI that will generate really challenging would you rather scenarios. 
                            Example: Would you rather pee out a grape or poop out a pineapple.  
                            Example: Would you rather have a gay son or a thot daughter.
                            Example: Would you rather pee your pants in public once a week or poop your pants in private every other day.
                            Example: Would you rather have to use sandpaper as toilet paper or have to use hot sauce as eye drops.

                            Important: Generate a completely new and unique scenario each time.
                            Try to use simple vocabulary so the user can understand it easier.
                            Only output the would you rather scenario.
                            Timestamp: ${timestamp}`,
                        },
                        {
                            role: 'user',
                            content: `Generate a unique would you rather scenario. Current time: ${timestamp}`,
                        },
                    ],
                }),
            });
            const data = await response.json();
            setScenario(data.output);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-8">Would You Rather?</h1>

            <button
                onClick={generateScenario}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                {loading ? 'Generating...' : 'Generate Scenario'}
            </button>

            {scenario && (
                <div className="max-w-lg p-6 bg-gray-900 rounded-lg shadow-lg">
                    <p className="text-lg">{scenario}</p>
                </div>
            )}
        </div>
    );
}
