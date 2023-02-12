import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RecommenderState {
  chosenTracks: SpotifyApi.TrackObjectFull[];
  addChosenTrack: (track: SpotifyApi.TrackObjectFull) => void;
  recommendations: SpotifyApi.RecommendationTrackObject[][];
  setRecommendations: (
    recommendations: SpotifyApi.RecommendationTrackObject[]
  ) => void;
  features: SpotifyApi.AudioFeaturesResponse[];
  setFeatures: (features: SpotifyApi.AudioFeaturesResponse) => void;
  seedTracks: any;
  setSeedTracks: (seedTracks: any) => void;
  removeAll: () => void;
}

const useRecommenderStore = create<RecommenderState>()(
  devtools(
    (set) => ({
      chosenTracks: [],
      features: [],
      recommendations: [],
      seedTracks: [],
      addChosenTrack: (track) =>
        set((state) => ({
          chosenTracks: [...state.chosenTracks, track],
        })),
      setFeatures: (features) =>
        set((state) => ({
          features: [...state.features, features],
        })),
      setRecommendations: (recommendations) =>
        set((state) => ({
          recommendations: [...state.recommendations, recommendations],
        })),
      setSeedTracks: (tracks) =>
        set((state) => ({
          seedTracks: [tracks.sort(() => Math.random() - 0.5)],
        })),
      removeAll: () =>
        set({
          chosenTracks: [],
          features: [],
          recommendations: [],
          seedTracks: [],
        }),
    }),
    { name: "recommender-store" }
  )
);

export default useRecommenderStore;
