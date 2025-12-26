
function getLengthString(str, length) {
  return str.length <= length;
}

export function getPalindrom(str) {
  const cleanStr = str.replace(/[^a-zа-яё]/gi, '').toLowerCase();
  return cleanStr === cleanStr.split('').reverse().join('');
}

export function runTask1() {
  return {
    test1: {
      str: 'Hello, My name is Ivan',
      lenStr: 10,

      get result() {
        return `Строка: ${this.str}, число: ${this.lenStr}, длина строки меньше или равно числу?\nОтвет: ${getLengthString(this.str, this.lenStr)}.`;
      }
    },
    test2: {
      str: 'Hello, My name is Ivan',
      lenStr: 50,

      result: function() {
        return `Строка: ${this.str}, число: ${this.lenStr}, длина строки меньше или равно числу? Ответ: ${getLengthString(this.str, this.lenStr)}.`;
      }
    }
  };
}

export function runTask2(){{
  return {
    test1: {
      str: 'топот',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
    test2: {
      str: 'ДовОд',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
    test3: {
      str: 'Кекс',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
    test4: {
      str: 'Лёша на полке клопа нашёл',

      get result() {
        return `Слово(Предложение): ${this.str} - палиндром? \nОтвет: ${getPalindrom(this.str)}`;
      }
    },
  };
}}

function timeToMinutes(timeStr)
{
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getControlTime(start, end, meet, duration)
{
  const startWork = timeToMinutes(start);
  const endWork = timeToMinutes(end);
  const startMeet = timeToMinutes(meet);
  const endMeet = startMeet + duration;

  return startMeet >= startWork && endMeet <= endWork;
}
