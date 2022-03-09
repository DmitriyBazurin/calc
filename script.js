document.addEventListener('DOMContentLoaded', function() {
   const firstInput = document.getElementById('first_input');
   const secondInput = document.getElementById('second_input');
   const resultInput = document.getElementById('result');
   firstInput.onkeydown = isAllowedCharacters;
   secondInput.onkeydown = isAllowedCharacters;
   firstInput.oninput = inputHandler;
   secondInput.oninput = inputHandler;

   /**
    * Обработчик нажатия клавиш в поле ввода
    * разрешает ввод чисел длинной не более 256 символов и
    * символы "Backspace", "Delete" и "Tab" для редактирования и перемешения между полями ввода
    */
   function isAllowedCharacters(event) {
      const numberRegExp = /[^\D]/g;
      const maxLength = 256;
      const isAllowedCharacters = event.key === 'Backspace' || event.key === 'Tab' ||
         event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || numberRegExp.test(event.key);
      return isAllowedCharacters && this.value.length <= maxLength;
   }

   /**
    * Обработчик ввода символов в поле ввода
    */
   function inputHandler() {
      const firstValue = firstInput.value;
      const secondValue = secondInput.value;
      if (!firstValue || !secondValue) {
         return;
      }
      if (isPositiveResult(firstValue, secondValue)) {
         resultInput.value = calc(firstValue, secondValue, true);
      } else {
         resultInput.value = calc(secondValue, firstValue, false);
      }
   }

   /**
    * Проверка на то, что результат вычитания будет положитеотный или отрицательный
    */
   function isPositiveResult(firstValue, secondValue) {
      if (firstValue.length > secondValue.length) {
         return true;
      } else if (firstValue.length < secondValue.length) {
         return false;
      } else {
         const firstArr = firstValue.split('');
         const secondArr = secondValue.split('');
         return firstArr.some((elem, i) => {
            const firstNumberElem = Number(elem);
            const secondNumberElem = Number(secondArr[i]);
            if (i === firstArr.length - 1 && firstNumberElem === secondNumberElem) {
               return true;
            } else {
               return firstNumberElem > secondNumberElem;
            }
         });
      }
   }

   /**
    * Функция посимвольного вычитания большего числа из меньшего
    */
   function calc(firstValue, secondValue, isPositive) {
      if (firstValue && secondValue) {
         // делаем reverse, чтобы было при вычиатнии удобней обращаться к обоим элементам массива
         const firstArr = firstValue.split('').reverse();
         const secondArr = secondValue.split('').reverse();
         const resArr = [];
         for(let i = 0; i < firstArr.length; i++) {
            const firstNumberElem = Number(firstArr[i]);
            const secondNumberElem = Number(secondArr[i]);
            if (secondArr[i] !== undefined) {
               if (firstNumberElem >= secondNumberElem) {
                  resArr.push(firstNumberElem - secondNumberElem);
               } else {
                  // значит надо занять у следующей цифры
                  let j = i + 1;
                  while (j < firstArr.length) {
                     if (firstArr[j] !== '0') {
                        // если это не ноль, то отнимаем одно значение и выходим из цикла
                        firstArr[j] = String(Number(firstArr[j]) - 1);
                        break;
                     } else {
                        // если это ноль, то присваиваем девятку и идем дальше
                        firstArr[j] = '9';
                        j++;
                     }
                  }
                  resArr.push(String(firstNumberElem + 10 - secondNumberElem));
               }
            } else {
               resArr.push(firstArr[i]);
            }
         }

         // убираем все ненужные нули вначале строки
         let res = resArr.reverse().join('').replace(/^0+/, '');
         if (!res) {
            res = '0';
         }
         if (!isPositive) {
            res = '-' + res;
         }

         return res;
      }
   }
});
