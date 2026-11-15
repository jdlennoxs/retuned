import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Step = "Start" | "First" | "Second" | "Third" | "Finished";

interface MapperState {
    offsets: {
        mediumLimit: number;
        shortLimit: number;
        recentLimit: number;
        mediumOffset: number;
        shortOffset: number;
    };
    step: Step;
    hasSeedTracks: boolean;
    chosenTracks: SpotifyApi.TrackObjectFull[];
    addChosenTrack: (track: SpotifyApi.TrackObjectFull) => void;
    features: SpotifyApi.AudioFeaturesResponse[];
    setFeatures: (features: SpotifyApi.AudioFeaturesResponse) => void;
    setStep: (nextStep: Step) => void;
    removeAll: () => void;
    seedTracks: SpotifyApi.TrackObjectFull[];
    setSeedTracks: (tracks: SpotifyApi.TrackObjectFull[]) => void;
    setHasSeedTracks: () => void;
    recommendations: SpotifyApi.RecommendationTrackObject[][];
    setRecommendations: (
        recommendations: SpotifyApi.RecommendationTrackObject[]
    ) => void;
}

const LIMIT = 15;

const useMapperStore = create<MapperState>()(
    devtools(
        (set) => ({
            offsets: {
                mediumLimit: LIMIT,
                shortLimit: LIMIT,
                recentLimit: LIMIT,
                mediumOffset: Math.floor(Math.random() * (50 - LIMIT)),
                shortOffset: Math.floor(Math.random() * (50 - LIMIT)),
            },
            hasSeedTracks: false,
            seedTracks: [],
            chosenTracks: [],
            features: [],
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
            setSeedTracks: (tracks) => set({ seedTracks: tracks }),
            setHasSeedTracks: () => set({ hasSeedTracks: true }),
            recommendations: [],
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
        { name: "mapper-store" }
    )
);

export default useMapperStore;
