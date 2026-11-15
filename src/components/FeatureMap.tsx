import { last } from "ramda";
import useMapperStore from "@/utils/useMapperStore";
import { trpc } from "@/utils/trpc";
import Cube from "@/components/Cube";

const FeatureMap = () => {
  const { chosenTracks } = useMapperStore();
  const current = last(chosenTracks);
  const originalArtistIds = new Set(
    current?.artists.map((artist) => artist.id)
  );

  const recommendations = trpc.spotify.getRecommendations.useQuery(
    { seedTracks: current?.id },
    { enabled: !!current }
  );

  const tracks =
    current && recommendations.isSuccess
      ? [
          current,
          ...recommendations.data.body.tracks
            .filter(
              (track) =>
                track.id !== current.id &&
                track.preview_url !== null &&
                !track.artists.some((artist) =>
                  originalArtistIds.has(artist.id)
                )
            )
            .slice(0, 6),
        ]
      : [];

  const featureQueries = trpc.useQueries((query) =>
    tracks.map((track) => query.spotify.getTrackFeatures(track.id))
  );

  const hasError =
    recommendations.isError || featureQueries.some((query) => query.isError);

  const isReady =
    !!current &&
    recommendations.isSuccess &&
    featureQueries.every((query) => query.isSuccess);

  const plottedTracks = tracks.map((track, index) => ({
    track,
    features: featureQueries[index]?.data?.body,
  }));

  if (!isReady) return <div>Loading...</div>;
  return <Cube tracks={plottedTracks} />;
};

export default FeatureMap;
