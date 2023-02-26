import useRecommenderStore from "./useRecommenderStore";

const iterateStep = () => {
  const step = useRecommenderStore.getState().step;
  if (step === "Start") {
    useRecommenderStore.setState({ step: "First" });
    return "First";
  }
  if (step === "First") {
    useRecommenderStore.setState({ step: "Second" });
    return "Second";
  }
  if (step === "Second") {
    useRecommenderStore.setState({ step: "Third" });
    return "Third";
  }
  if (step === "Third") {
    useRecommenderStore.setState({ step: "Finished" });
    return "Finished";
  }
};

export default iterateStep;
