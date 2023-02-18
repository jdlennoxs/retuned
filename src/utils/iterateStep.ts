import useRecommenderStore from "./useRecommenderStore";

const iterateStep = () => {
  const step = useRecommenderStore.getState().step;
  if (step === "Start") {
    useRecommenderStore.setState({ step: "First" });
  }
  if (step === "First") {
    useRecommenderStore.setState({ step: "Second" });
  }
  if (step === "Second") {
    useRecommenderStore.setState({ step: "Third" });
  }
  if (step === "Third") {
    useRecommenderStore.setState({ step: "Finished" });
  }
};

export default iterateStep;
