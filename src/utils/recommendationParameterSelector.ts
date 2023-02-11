import { mean, pluck } from "ramda";

const recommendationParamSelector = (state) => {
  switch (state.chosenTracks.length) {
    case 1:
      return { seedTracks: state.chosenTracks[0].id };
    case 2:
      return { seedTracks: state.chosenTracks[1].id };
    case 4:
      return {
        seedTracks: `${state.chosenTracks[0].id},${state.chosenTracks[1].id},${state.chosenTracks[2].id},${state.chosenTracks[3].id}`,
        targetLoudness: mean(pluck("loudness", state.features)),
        targetValence: mean(pluck("valence", state.features)),
        targetEnergy: mean(pluck("energy", state.features)),
      };
    default:
      return {};
  }
};

export default recommendationParamSelector;
