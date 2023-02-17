const iterateStep = ({ step, setStep }) => {
  if (step === "Start") {
    setStep("First");
  }
  if (step === "First") {
    setStep("Second");
  }
  if (step === "Second") {
    setStep("Third");
  }
  if (step === "Third") {
    setStep("Finished");
  }
};

export default iterateStep;
