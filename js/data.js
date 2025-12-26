import {createIdGenerator, createRandomIdFromRangeGenerator, getRandomInteger} from './utils.js';

const NAMES = [
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
];

const DESCRIPTION = [
  'Закат над горным озером в Альпах',
  'Уличный музыкант играет на саксофоне в Париже',
  'Кофе на деревянном столе утренним светом',
  'Старый книжный магазин с витриной в дождь',
  'Котенок спит в цветочном горшке',
  'Осенний лес с золотыми листьями',
  'Неоновые вывески Токио ночью',
  'Дети запускают воздушного змея на пляже',
  'Архитектурные детали старинного собора',
  'Макросъемка капель росы на паутине',
  'Рыночный ряд со специями в Марракеше',
  'Снежные вершины Гималаев на рассвете',
  'Портрет пожилого человека с морщинами мудрости',
  'Винтажный автомобиль на пустынной дороге',
  'Подводный мир кораллового рифа',
  'Уличное граффити в берлинском районе',
  'Семейный пикник в цветущем саду',
  'Огни большого города с высоты птичьего полета',
  'Рыбак в лодке на туманном озере',
  'Библиотека с высокими деревянными стеллажами'
];

const COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const SIMILAR_USERS_COUNT = 25;
const SIMILAR_URL_COUNT = 6;
const MAX_COUNT_COMMENTS = 30;

const generateId = createRandomIdFromRangeGenerator(1, SIMILAR_USERS_COUNT);
const generateURLId = createRandomIdFromRangeGenerator(1, SIMILAR_USERS_COUNT);
const generateCommentsId = createIdGenerator();
const generateCountComments = createRandomIdFromRangeGenerator(0, MAX_COUNT_COMMENTS);
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const createComments = () => ({
  avatar: `img/avatar-${getRandomInteger(1, SIMILAR_URL_COUNT)}.svg`,
  message: `${getRandomArrayElement(COMMENTS)}`,
  name: `${getRandomArrayElement(NAMES)}`,
  id: generateCommentsId(),
});

const createUsers = () => ({
  id: generateId(),
  url: `photos/${generateURLId()}.jpg`,
  description: `${getRandomArrayElement(DESCRIPTION)}`,
  likes: getRandomInteger(15, 200),
  comments: Array.from({length: generateCountComments()}, createComments),
});


const generateSimilarPhotos = () => Array.from({length: SIMILAR_USERS_COUNT}, createUsers);
export {generateSimilarPhotos};
