import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface RecommenderState {
  chosenTracks: SpotifyApi.TrackObjectFull[];
  addChosenTrack: (track: SpotifyApi.TrackObjectFull) => void;
  recommendations: SpotifyApi.TrackObjectFull[][];
  setRecommendations: (recommendations: SpotifyApi.TrackObjectFull[]) => void;
  features: SpotifyApi.AudioFeaturesResponse[];
  setFeatures: (features: SpotifyApi.AudioFeaturesResponse) => void;
}

const useRecommenderStore = create<RecommenderState>()(
  devtools(
    (set) => ({
      chosenTracks: [],
      features: [],
      recommendations: [],
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
      removeAll: () => set({ chosenTracks: [] }),
    }),
    { name: "recommender-store" }
  )
);

export default useRecommenderStore;
