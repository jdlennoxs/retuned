const titles = {
  blue: ["Melancholy", "Gloomy", "Despondent", "Bleak"],
  green: ["Moody", "Unpredictable", "Diverse", "Jagged"],
  yellow: ["Chill", "Cool", "Soothing", "Fresh"],
  red: ["Life Affirming", "Lively", "Exilharating", "Upbeat"],
};

export const getTitle = ({
  name,
  targetEnergy,
  targetValence,
  randomNumber,
}) => {
  if (targetValence < 0.5) {
    if (targetEnergy < 0.5) {
      return `${
        titles.blue[Math.floor(randomNumber * titles.blue.length)]
      } ${name}`;
    }
    return `${
      titles.green[Math.floor(randomNumber * titles.green.length)]
    } ${name}`;
  }
  if (targetEnergy < 0.5) {
    return `${
      titles.yellow[Math.floor(randomNumber * titles.yellow.length)]
    } ${name}`;
  }
  return `${titles.red[Math.floor(randomNumber * titles.red.length)]} ${name}`;
};
