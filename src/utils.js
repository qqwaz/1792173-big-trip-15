export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInt = (a, b = 0) => {
  const [min, max] = a > b ? [b, a] : [a, b];
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomArrayElement = (array) => array[getRandomInt(array.length - 1)];

export const getShuffledArray = (array, length) => {
  const result = new Array(Math.min(array.length, length || array.length)).fill();
  result.forEach((x, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], array[j]] = [array[j], array[i]];
  });
  return result;
};

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

