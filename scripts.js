'use strict'

const openParenEl = document.getElementById('operator-open-paren');
const closeParenEl = document.getElementById('operator-close-paren');
const percentEl = document.getElementById('operator-percent');
const clearEl = document.getElementById('operator-clear');
const periodEl = document.getElementById('number-period');
const numbersEl = document.querySelectorAll('.number');
const equalsEl = document.getElementById('operator-equals');

const divideEl = document.getElementById('operator-divide');
const multiplyEl = document.getElementById('operator-multiply');
const minusEl = document.getElementById('operator-minus');
const plusEl = document.getElementById('operator-plus');

const inputValueEl = document.getElementById('input-value');
const ansValueEl = document.getElementById('ans');

const operatorMap = new Map([
    ['/', divideEl],
    ['*', multiplyEl],
    ['-', minusEl],
    ['+', plusEl],
]);

const operators = ['*', '/', '+', '-'];

let equalsPressed = false;
let percentPressed = false;
let currentInput = '';
let answer = '';

//allows user to use the number buttons (0-9)
for (const number of numbersEl) {

    number.addEventListener('click', () => {

        //if the user pressed equals and then begins to type numbers,  
        //the clear function will be executed
        if (equalsPressed) {

            clear();
            equalsPressed = false;
        }

        if (percentPressed) {

            addOperator(' * ');
            percentPressed = false;
        }

        //find the current integer
        let currentInt = findlastNumber();

        //if the currentInput ends in a 0 and currentInt does not contain a period
        //the 0 will be switched to the number
        // prevents inputs such as 02 but will allow 0.02
        if (!currentInt.includes('.') && currentInt[0] === '0') {

            currentInput = currentInput.substring(0, currentInput.length - 1);
        }

        //if the currentInput ends in a close paren, a multiplication symbol will 
        //be added after the paren and before the number the user clicks
        if (currentInput[currentInput.length - 1] === ')') {

            currentInput += ' * ' + number.value;
        } else {

            //otherwise the number will simply be added to currentInput
            currentInput += number.value;
        }

        updateInnerHTML();
    });
}

//allows user to use the period button  
periodEl.addEventListener('click', () => {

    if (equalsPressed) {

        clear();
        equalsPressed = false;
    }

    let currentInt = findlastNumber();

    //if the current integer already has a period,
    //one will not be added
    if (!currentInt.includes('.')) {

        if (currentInt.includes(')')) {

            currentInput += (' * 0.');
            updateInnerHTML();

        } else if (currentInt === '') {

            currentInput += '0';
            addSymbol('.');

        } else {

            addSymbol('.');
        }
    }
});

//allows user to use the open parentheses button
openParenEl.addEventListener('click', () => {

    //if the second to last element in currentInput
    //is an operator a space will be added 
    //for asthetic reasons  
    if (operators.includes(currentInput[currentInput.length - 2])) {

        addSymbol(' (');

    } else if (currentInput === '') {

        //else if the user hasnt input anything yet
        //just the paren will be added
        currentInput = '(';
        updateInnerHTML();

    } else if (currentInput[currentInput.length - 1] === '(') {

        addSymbol('(');

    } else {
        //a multiplication sign will be added
        //ie '2 * (' instead of '2(' 
        //since eval() wont work on '2('
        addSymbol(' * (');
    }
});

//allows user to use the close parentheses button
closeParenEl.addEventListener('click', () => {

    let currentInt = findlastNumber();

    //find the number of parenthesis
    let numOfOpenParens = 0;
    let numOfCloseParens = 0;

    for (const input of currentInput) {

        if (input === '(') numOfOpenParens++
        if (input === ')') numOfCloseParens++
    }

    //if there is an open paren in currentInput,
    //the user can add a close paren
    if (currentInput.includes('(') && currentInt !== '' && numOfOpenParens !== numOfCloseParens) {

        addSymbol(')');
    }
});

//allows user to use the percent button
percentEl.addEventListener('click', () => {

    //if the last element in currentInput is not a
    //'(' or ')' or ' '
    if (!['(', ')', ' '].includes(currentInput[currentInput.length - 1])) {

        equalsPressed = false;
        percentPressed = true;
        //find the length of the current integer
        let lengthOfNumb = findlastNumber().length;

        //divide the current integer by 100
        currentInput = String(currentInput.substring(0, currentInput.length - lengthOfNumb) + ' ' + currentInput.substring(currentInput.length - lengthOfNumb) / 100);

        updateInnerHTML();
    }
});


//allows user to clear the current input
clearEl.addEventListener('click', clear);

for (const [key, value] of operatorMap) {

    value.addEventListener('click', () => {
        addOperator(key);
    });
}

//allows user to use equals button
equalsEl.addEventListener('click', () => {

    if (currentInput !== '') {

        //adds a 1 if the user doesn't add a number after an open paren
        if (currentInput[currentInput.length - 1] === '(') currentInput += '1';

        //if currentInput ends in an operator, a number will be added
        if (operators.includes(currentInput[currentInput.length - 2])) {

            if (currentInput[currentInput.length - 2] === '-' || currentInput[currentInput.length - 2] === '+') {

                currentInput += '0';
            } else {

                currentInput += '1';
            }
        }

        //find the number of parenthesis
        let numOfOpenParens = 0;
        let numOfCloseParens = 0;

        for (const char of currentInput) {

            if (char === '(') numOfOpenParens++
            if (char === ')') numOfCloseParens++
        }

        //if there's not an equal number of open and close parens
        // number of open parens - number of close parens 
        //close parens will be added to the end
        if (numOfOpenParens !== numOfCloseParens) {

            for (let i = 0; i < numOfOpenParens - numOfCloseParens; i++) {

                currentInput += ')';
            }
        }

        //will evaluate the total input
        answer = String(eval(currentInput));
        if (answer === 'NaN') answer = 'Error'
        //shows the answer
        inputValueEl.innerHTML = answer;
        //changes all the *'s to the times symbol for asthetics
        //updates the 'ans = ' text
        ansValueEl.innerHTML = currentInput.replace(/\*/g, "&times") + ' =';
        currentInput = answer;
        equalsPressed = true;
    }
});

document.addEventListener('keydown', function (e) {

    if (e.key === 'c') {

        clear();
    }

    if (e.key === 'Enter') {

        if (currentInput !== '') {

            //adds a 1 if the user doesn't add a number after an open paren
            if (currentInput[currentInput.length - 1] === '(') currentInput += '1';

            //if currentInput ends in an operator, a number will be added
            if (operators.includes(currentInput[currentInput.length - 2])) {

                if (currentInput[currentInput.length - 2] === '-' || currentInput[currentInput.length - 2] === '+') {

                    currentInput += '0';
                } else {

                    currentInput += '1';
                }
            }

            //find the number of parenthesis
            let numOfOpenParens = 0;
            let numOfCloseParens = 0;

            for (const char of currentInput) {

                if (char === '(') numOfOpenParens++
                if (char === ')') numOfCloseParens++
            }

            //if there's not an equal number of open and close parens
            // number of open parens - number of close parens 
            //close parens will be added to the end
            if (numOfOpenParens !== numOfCloseParens) {

                for (let i = 0; i < numOfOpenParens - numOfCloseParens; i++) {

                    currentInput += ')';
                }
            }

            //will evaluate the total input
            answer = String(eval(currentInput));
            if (answer === 'NaN') answer = 'Error'
            //shows the answer
            inputValueEl.innerHTML = answer;
            //changes all the *'s to the times symbol for asthetics
            //updates the 'ans = ' text
            ansValueEl.innerHTML = currentInput.replace(/\*/g, "&times") + ' =';
            currentInput = answer;
            equalsPressed = true;
        }
    }

    if (e.key === '.') {

        if (equalsPressed) {

            clear();
            equalsPressed = false;
        }

        let currentInt = findlastNumber();

        //if the current integer already has a period,
        //one will not be added
        if (!currentInt.includes('.')) {

            if (currentInt.includes(')')) {

                currentInput += (' * 0.');
                updateInnerHTML();

            } else if (currentInt === '') {

                currentInput += '0';
                addSymbol('.');

            } else {

                addSymbol('.');
            }
        }
    }

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    if (numbers.includes(e.key)) {

        //if the user pressed equals and then begins to type numbers,  
        //the clear function will be executed
        if (equalsPressed) {

            clear();
            equalsPressed = false;
        }

        if (percentPressed) {

            addOperator(' * ');
            percentPressed = false;
        }

        //find the current integer
        let currentInt = findlastNumber();

        //if the currentInput ends in a 0 and currentInt does not contain a period
        //the 0 will be switched to the number
        // prevents inputs such as 02 but will allow 0.02
        if (!currentInt.includes('.') && currentInt[0] === '0') {

            currentInput = currentInput.substring(0, currentInput.length - 1);
        }

        //if the currentInput ends in a close paren, a multiplication symbol will 
        //be added after the paren and before the number the user clicks
        if (currentInput[currentInput.length - 1] === ')') {

            currentInput += ' * ' + e.key;
        } else {

            //otherwise the number will simply be added to currentInput
            currentInput += e.key;
        }

        updateInnerHTML();
    }
});




/************************* FUNCTIONS *************************/


//will add an operator to the end of the currentInput string
//for adding +, -, /, *
function addOperator(operator) {

    equalsPressed = false;
    percentPressed = false;

    //will not add a 0 to the front if there is no input
    //and if the user clicks the '-' button
    //to account for negative signs
    if (operator != '-' && currentInput == '') currentInput = '0'

    //this will switch the sign if currentInput already ends in a sign
    if (currentInput.length !== 2 && operators.includes(currentInput[currentInput.length - 2])) {

        currentInput = currentInput.substring(0, currentInput.length - 2) + operator + currentInput.substring(currentInput.length - 1);
        updateInnerHTML();

        //else it will just add the sign
    } else if (currentInput[currentInput.length - 1] !== '(') {

        currentInput += ' ' + operator + ' ';
        updateInnerHTML();
    }
}

//for adding any symbol such as ( or )
function addSymbol(symbol) {

    equalsPressed = false;

    if (currentInput == '') currentInput = '0'
    currentInput += symbol;
    updateInnerHTML();
}

//updates the inner html
function updateInnerHTML() {

    //changes all the * in currenInput to be displayed as the times symbol
    let innerHTML = currentInput.replaceAll('*', "&times");
    inputValueEl.innerHTML = innerHTML;
}

function clear() {

    //clears the texts
    inputValueEl.innerHTML = '0';
    //sets the answer text to display the equation
    ansValueEl.innerHTML = `Ans = ${answer}`
    //sets the currentInput blank
    currentInput = '';
    percentPressed = false;
}

//finds the last number of currentInt
function findlastNumber() {

    let lastNumber = '';

    if (currentInput[currentInput.length - 1] === ')') {

        lastNumber = ')';
    } else {

        for (let i = currentInput.length - 1; i >= 0; i--) {

            if (currentInput[i] === ' ' || currentInput[i] === '(') break;
            lastNumber = currentInput[i] + lastNumber;
        }
    }

    return lastNumber;
}