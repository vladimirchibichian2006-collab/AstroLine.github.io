class MatrixCalculator {
    constructor() {
        this.numberMeanings = {
            1: "Лидерство, независимость, амбиции",
            2: "Партнерство, дипломатия, чувствительность", 
            3: "Творчество, общение, самовыражение",
            4: "Стабильность, практичность, трудолюбие",
            5: "Свобода, приключения, изменения",
            6: "Гармония, ответственность, семья",
            7: "Анализ, духовность, интуиция",
            8: "Власть, деньги, успех",
            9: "Завершение, мудрость, гуманизм",
            11: "Интуиция, вдохновение, духовность",
            22: "Практическая духовность, мастер-строитель",
            33: "Мастер-учитель, служение человечеству"
        };
    }

    calculateMatrix(birthDate) {
        const day = birthDate.getDate();
        const month = birthDate.getMonth() + 1;
        const year = birthDate.getFullYear();

        // Расчет основных чисел
        const destinyNumber = this.reduceNumber(day + month + year);
        const characterNumber = this.reduceNumber(day);
        const heartNumber = this.reduceNumber(month);
        
        // Расчет дополнительных чисел
        const firstAdditional = this.reduceNumber(day + month);
        const secondAdditional = this.reduceNumber(day + year);
        const thirdAdditional = this.reduceNumber(month + year);
        const fourthAdditional = this.reduceNumber(firstAdditional + secondAdditional);

        return {
            destinyNumber: {
                number: destinyNumber,
                meaning: this.numberMeanings[destinyNumber] || "Особое значение"
            },
            characterNumber: {
                number: characterNumber,
                meaning: this.numberMeanings[characterNumber] || "Особое значение"
            },
            heartNumber: {
                number: heartNumber,
                meaning: this.numberMeanings[heartNumber] || "Особое значение"
            },
            additionalNumbers: {
                first: {
                    number: firstAdditional,
                    meaning: this.numberMeanings[firstAdditional] || "Особое значение"
                },
                second: {
                    number: secondAdditional,
                    meaning: this.numberMeanings[secondAdditional] || "Особое значение"
                },
                third: {
                    number: thirdAdditional,
                    meaning: this.numberMeanings[thirdAdditional] || "Особое значение"
                },
                fourth: {
                    number: fourthAdditional,
                    meaning: this.numberMeanings[fourthAdditional] || "Особое значение"
                }
            }
        };
    }

    reduceNumber(num) {
        while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
            num = this.sumDigits(num);
        }
        return num;
    }

    sumDigits(num) {
        return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    generateMatrixGrid(numbers) {
        const grid = Array(9).fill(null);
        
        // Заполняем сетку 3x3
        grid[0] = numbers.characterNumber.number;      // Верхний левый
        grid[1] = numbers.destinyNumber.number;        // Верхний центр
        grid[2] = numbers.heartNumber.number;          // Верхний правый
        
        grid[3] = numbers.additionalNumbers.first.number;  // Средний левый
        grid[4] = numbers.additionalNumbers.fourth.number; // Центр
        grid[5] = numbers.additionalNumbers.second.number; // Средний правый
        
        grid[6] = 0; // Нижний левый (резерв)
        grid[7] = numbers.additionalNumbers.third.number;  // Нижний центр
        grid[8] = 0; // Нижний правый (резерв)
        
        return grid;
    }
}