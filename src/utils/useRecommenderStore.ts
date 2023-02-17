import { create } from "zustand";
import { devtools } from "zustand/middleware";

const Steps = ["Start", "First", "Second", "Third", "Finished"] as const;
type Step = typeof Steps[number];

interface RecommenderState {
  offsets: any;
  step: Step;
  chosenTracks: SpotifyApi.TrackObjectFull[];
  addChosenTrack: (track: SpotifyApi.TrackObjectFull) => void;
  recommendations: SpotifyApi.RecommendationTrackObject[][];
  setRecommendations: (
    recommendations: SpotifyApi.RecommendationTrackObject[]
  ) => void;
  features: SpotifyApi.AudioFeaturesResponse[];
  setFeatures: (features: SpotifyApi.AudioFeaturesResponse) => void;
  setStep: (nextStep: Step) => void;
  removeAll: () => void;
}

const LIMIT = 10;

const useRecommenderStore = create<RecommenderState>()(
  devtools(
    (set) => ({
      offsets: {
        mediumLimit: LIMIT,
        shortLimit: LIMIT,
        recentLimit: LIMIT,
        mediumOffset: Math.floor(Math.random() * (50 - LIMIT)),
        shortOffset: Math.floor(Math.random() * (50 - LIMIT)),
      },
      chosenTracks: [],
      features: [],
      recommendations: [],
      step: "Start",
      setStep: (nextStep) =>
        set({
          step: nextStep,
        }),
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
      removeAll: () =>
        set({
          step: "Start",
          chosenTracks: [],
          features: [],
          recommendations: [],
        }),
    }),
    { name: "recommender-store" }
  )
);

export default useRecommenderStore;
