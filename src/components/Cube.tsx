import { Track } from "@/components/Track";
import { PreviewWrapper } from "./PreviewWrapper";

type MapProps = {
  tracks: {
    track: SpotifyApi.TrackObjectFull;
    features?: SpotifyApi.AudioFeaturesResponse;
  }[];
};

type Position = { x: number; y: number };

function TrackMap({ tracks }: MapProps) {
  const current = tracks[0];
  const next = tracks.slice(1);

  return (
    <div
      style={{
        position: "relative",
        width: 600,
        height: 600,
        background: "rgba(0, 0, 0, 0.1)",
        borderRadius: 20,
        margin: "36px 100px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: 12,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            borderTop: "1px dashed rgba(255, 255, 255, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            borderLeft: "1px dashed rgba(255, 255, 255, 0.15)",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: -28,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Higher energy ↑
        </span>
        <span
          style={{
            position: "absolute",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Lower energy ↓
        </span>
        <span
          style={{
            position: "absolute",
            left: -16,
            top: "50%",
            transform: "translate(-100%, -50%)",
          }}
        >
          ← Sadder
        </span>
        <span
          style={{
            position: "absolute",
            right: -16,
            top: "50%",
            transform: "translate(100%, -50%)",
          }}
        >
          Happier →
        </span>
      </div>
      {/* SVG background alternative (replace the CSS background when using it):
      <svg
        width={600}
        height={600}
        viewBox="0 0 600 600"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <rect width="600" height="600" rx="20" fill="rgba(0, 0, 0, 0.1)" />
      </svg>
      */}
      {current?.features && (
        <TrackWrapper
          x={current.features.valence * 600}
          y={600 - current.features.energy * 600}
          track={current.track}
        />
      )}
      {next.map(({ track, features }) =>
        features ? (
          <TrackWrapper
            key={track.id}
            x={features.valence * 600}
            y={600 - features.energy * 600}
            track={track}
            masked
            onClick
          />
        ) : null
      )}
    </div>
  );
}

// Define the Track component
function TrackWrapper({
  x,
  y,
  track,
  masked,
}: Position & {
  track: SpotifyApi.TrackObjectFull;
  masked?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 10, // Adjust for centering
        top: y - 10, // Adjust for centering
        // width: 40,
        // height: 40,
      }}
    >
      <PreviewWrapper previewUrl={track.preview_url ?? ""}>
        {masked ? (
          <div
            style={{
              position: "relative",
              width: 56,
              height: 56,
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: 20,
            }}
          />
        ) : (
          <Track track={track} />
        )}
      </PreviewWrapper>
    </div>
  );
}

function App({ tracks }: Partial<MapProps>) {
  const current = tracks?.[0];
  if (!tracks || !current?.features) {
    return <div className="m-auto text-white">Track features unavailable.</div>;
  }

  return (
    <div className="m-auto">
      {current.features.valence} {current.features.energy}
      <TrackMap tracks={tracks} />
    </div>
  );
}

export default App;
