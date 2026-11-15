import React, { useRef, useEffect } from 'react';
import { Track } from '@/components/Track';
import { PreviewWrapper } from './PreviewWrapper';

type MapProps = {
    points: SpotifyApi.AudioFeaturesResponse;
    tracks: SpotifyApi.TrackObjectFull;
};

type Position = { x: number; y: number };

function Canvas2D({ points, tracks }: MapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Add a state to hold the position of the Track component
    const [trackPosition, setTrackPosition] = React.useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a rounded rectangle with a black background and no border
        context.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Black with 10% opacity
        const radius = 20; // Adjust the radius for rounded corners
        context.beginPath();
        context.moveTo(radius, 0);
        context.lineTo(canvas.width - radius, 0);
        context.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        context.lineTo(canvas.width, canvas.height - radius);
        context.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        context.lineTo(radius, canvas.height);
        context.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        context.lineTo(0, radius);
        context.quadraticCurveTo(0, 0, radius, 0);
        context.closePath();
        context.fill();

        // Calculate the position for the Track component
        if (points) {
            const x = points.valence * canvas.width;
            const y = canvas.height - (points.energy * canvas.height);
            setTrackPosition({ x, y });
        }
    }, [points]);

    return (
        <div style={{ position: 'relative', width: 600, height: 600 }}>
            <canvas ref={canvasRef} width={600} height={600} />
            <TrackWrapper x={trackPosition.x} y={trackPosition.y} track={tracks} trackPosition={trackPosition} />
        </div>
    );
}

// Define the Track component
function TrackWrapper({ x, y, track, trackPosition }: Position & {
    track: SpotifyApi.TrackObjectFull;
    trackPosition: Position;
}) {
    return (
        <div style={{
            position: 'absolute',
            left: x - 10, // Adjust for centering
            top: y - 10,  // Adjust for centering
            // width: 40,
            // height: 40,
        }}>
            <PreviewWrapper previewUrl={track.preview_url ?? ''} >
                <Track track={track} />
                {JSON.stringify(trackPosition)}
            </PreviewWrapper>
        </div>
    );
}


function App({ points, tracks }: Partial<MapProps>) {
    if (!points || !tracks) {
        return <div className="m-auto text-white">Track features unavailable.</div>;
    }

    return (
        <div className='m-auto'>
            {points.valence} {points.energy}
            <Canvas2D points={points} tracks={tracks} />
        </div>
    );
}

export default App;