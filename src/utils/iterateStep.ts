import useMatcherStore from "./useMatcherStore";

const iterateStep = () => {
  const step = useMatcherStore.getState().step;
  if (step === "Start") {
    useMatcherStore.setState({ step: "First" });
    return "First";
  }
  if (step === "First") {
    useMatcherStore.setState({ step: "Second" });
    return "Second";
  }
  if (step === "Second") {
    useMatcherStore.setState({ step: "Third" });
    return "Third";
  }
  if (step === "Third") {
    useMatcherStore.setState({ step: "Finished" });
    return "Finished";
  }
};

export default iterateStep;
