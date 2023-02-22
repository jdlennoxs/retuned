import { mean, pluck } from "ramda";

const recommendationParamSelector = (state) => {
  switch (state.step) {
    case "First":
      return { seedTracks: state.chosenTracks[0].id };
    case "Second":
      return { seedTracks: state.chosenTracks[1].id };
    case "Finished":
      return {
        seedTracks: `${state.chosenTracks[2].id},${state.chosenTracks[3].id}`,
        targetLoudness: mean(pluck("loudness", state.features)),
        targetValence: mean(pluck("valence", state.features)),
        targetEnergy: mean(pluck("energy", state.features)),
      };
    default:
      return { seedTracks: undefined };
  }
};

export default recommendationParamSelector;
