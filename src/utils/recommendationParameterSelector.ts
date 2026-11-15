import { mean, pluck } from "ramda";
import { type RouterInputs } from "./trpc";

const recommendationParamSelector = (state): RouterInputs["spotify"]["getRecommendations"] => {
  switch (state.step) {
    case "First":
      return { seedTracks: state.chosenTracks[0].id };
    case "Second":
      return { seedTracks: state.chosenTracks[1].id };
    case "Finished":
      return {
        seedTracks: `${state.chosenTracks[2].id},${state.chosenTracks[3].id}`,
        ...(state.features.length > 0 ? {
          target_loudness: mean(pluck("loudness", state.features)),
          target_valence: mean(pluck("valence", state.features)),
          target_energy: mean(pluck("energy", state.features)),
        } : {}),
      };
    default:
      return { seedTracks: undefined };
  }
};

export default recommendationParamSelector;
