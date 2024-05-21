function validateNumberInput() {
    const numberInput = document.getElementById('numberInput').value;
    const toCodeButton = document.getElementById('toCodeButton');

    if (/^\d+$/.test(numberInput)) {
        const number = parseInt(numberInput, 10);
        if (number >= 1 && number.toString().length <= 1000) {
            toCodeButton.disabled = false;
        } else {
            toCodeButton.disabled = true;
        }
    } else {
        toCodeButton.disabled = true;
    }
}

function validateCodeInput() {
    const codeInput = document.getElementById('codeInput').value;
    const toNumberButton = document.getElementById('toNumberButton');
    const toWordsButton = document.getElementById('toWordsButton');
    
    if (/^[01]+$/.test(codeInput) && codeInput.length <= 1000) {
        toNumberButton.disabled = false;
        toWordsButton.disabled = false;
    } else {
        toNumberButton.disabled = true;
        toWordsButton.disabled = true;
    }
}

function validateWordInput() {
    const wordInput = document.getElementById('wordInput').value;
    const toCodeFromWordButton = document.getElementById('toCodeFromWordButton');
    
    if (/^[a-zA-Z]+$/.test(wordInput)) {
        toCodeFromWordButton.disabled = false;
    } else {
        toCodeFromWordButton.disabled = true;
    }
}

function translateToCode() {
    const numberInput = document.getElementById('numberInput').value;
    const outputBox = document.getElementById('outputBox');
    const number = parseInt(numberInput, 10);
    
    if (isNaN(number)) {
        outputBox.value = 'Invalid input';
        return;
    }

    outputBox.value = convertNumberToCode(number);
    adjustOutputBoxHeight();
}

function translateToNumber() {
    const codeInput = document.getElementById('codeInput').value;
    const outputBox = document.getElementById('outputBox');
    
    outputBox.value = convertCodeToNumber(codeInput);
    adjustOutputBoxHeight();
}

function translateToWords() {
    const codeInput = document.getElementById('codeInput').value;
    const outputBox = document.getElementById('outputBox');
    
    outputBox.value = convertCodeToWords(codeInput);
    adjustOutputBoxHeight();
}

function translateWordToCode() {
    const wordInput = document.getElementById('wordInput').value;
    const outputBox = document.getElementById('outputBox');
    
    outputBox.value = convertWordToCode(wordInput);
    adjustOutputBoxHeight();
}

function convertNumberToCode(number) {
    if (number % 2 === 0) {
        return generateCode(number, '0');
    } else {
        return generateCode(number, '1');
    }
}

function generateCode(number, digit) {
    let code = '';
    let count = Math.floor((number + (digit === '0' ? 0 : 1)) / 2);
    let altDigit = digit === '0' ? '1' : '0';
    
    while (count > 0) {
        if (count > 3) {
            code += digit.repeat(3) + altDigit;
            count -= 3;
        } else {
            code += digit.repeat(count);
            count = 0;
        }
    }
    
    return code;
}

function convertCodeToNumber(code) {
    if (code.length === 0 || !/^[01]+$/.test(code)) {
        return 'Invalid Code';
    }

    let number = 0;
    let digitCount = 0;
    let prevDigit = '';

    for (let digit of code) {
        if (digit === prevDigit) {
            digitCount++;
            if (digitCount === 4) {
                return 'Invalid Code';
            }
        } else {
            digitCount = 1;
        }
        prevDigit = digit;
    }

    const isEven = code.startsWith('0');
    const digit = isEven ? '0' : '1';
    const altDigit = isEven ? '1' : '0';
    const repeats = code.split(altDigit).join('').length;
    
    number = (repeats * 2) - (isEven ? 0 : 1);
    return number;
}

function convertCodeToWords(code) {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

    let words = '';
    for (let i = 0; i < code.length; i += 5) {
        let segment = code.substring(i, i + 5);
        if (segment === '00000') {
            words += vowels[0];
        } else if (segment === '11110') {
            words += consonants[0];
        } else if (segment === '11111') {
            words += vowels[1];
        } else if (segment === '00001') {
            words += consonants[1];
        }
    }

    return words;
}

function convertWordToCode(word) {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

    let code = '';
    for (let char of word.toUpperCase()) {
        if (vowels.includes(char)) {
            code += '0000';
        } else if (consonants.includes(char)) {
            code += '1111';
        }
    }

    return code;
}

function adjustOutputBoxHeight() {
    const outputBox = document.getElementById('outputBox');
    outputBox.style.height = 'auto';
    outputBox.style.height = outputBox.scrollHeight + 'px';
}

document.getElementById('numberInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !document.getElementById('toCodeButton').disabled) {
        translateToCode();
    }
});

document.getElementById('codeInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        if (!document.getElementById('toNumberButton').disabled) {
            translateToNumber();
        } else if (!document.getElementById('toWordsButton').disabled) {
            translateToWords();
        }
    }
});

document.getElementById('wordInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !document.getElementById('toCodeFromWordButton').disabled) {
        translateWordToCode();
    }
});
