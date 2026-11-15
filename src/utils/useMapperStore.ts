import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Step = "Start" | "Map";

interface MapperState {
  step: Step;
  setStep: (nextStep: Step) => void;
  chosenTracks: SpotifyApi.TrackObjectFull[];
  addChosenTrack: (track: SpotifyApi.TrackObjectFull) => void;
  //   features: SpotifyApi.AudioFeaturesResponse[];
  //   setFeatures: (features: SpotifyApi.AudioFeaturesResponse) => void;
  removeAll: () => void;
  //   recommendations: SpotifyApi.RecommendationTrackObject[][];
  //   setRecommendations: (
  //     recommendations: SpotifyApi.RecommendationTrackObject[]
  //   ) => void;
}

const useMapperStore = create<MapperState>()(
  devtools(
    (set) => ({
      step: "Start",
      setStep: (nextStep) =>
        set({
          step: nextStep,
        }),
      chosenTracks: [],
      addChosenTrack: (track) =>
        set((state) => ({
          chosenTracks: [...state.chosenTracks, track],
        })),
      //   setFeatures: (features) =>
      //     set((state) => ({
      //       features: [...state.features, features],
      //     })),
      //   recommendations: [],
      //   setRecommendations: (recommendations) =>
      //     set((state) => ({
      //       recommendations: [...state.recommendations, recommendations],
      //     })),
      removeAll: () =>
        set({
          chosenTracks: [],
        }),
    }),
    { name: "mapper-store" }
  )
);

export default useMapperStore;
