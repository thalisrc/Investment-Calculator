import { generateReturnArray } from './src/investmentGoals.js';

const form = document.getElementById('investiment-form');
const clearFormButton = document.getElementById('clear-form');

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector('.error')) {
    return;
  }
  //const startingAmount = Number(form['starting-amount'].value)
  const startingAmount = Number(
    document.getElementById('starting-amount').value.replace(',', '.')
  );
  const additionalContribuition = Number(
    document.getElementById('additional-contribuition').value.replace(',', '.')
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const returnRate = Number(
    document.getElementById('return-rate').value
  ).replace(',', '.');
  const taxRate = Number(
    document.getElementById('tax-rate').value.replace(',', '.')
  );
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const timeAmountPeriod = document.getElementById('time-amount-period').value;

  const returnsArray = generateReturnArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribuition,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

function clearForm() {
  form['starting-amount'].value = '';
  form['additional-contribuition'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';

  const errorInputContainers = document.querySelectorAll('.error');
  errorInputContainers.forEach((errorContainer) =>
    errorContainer.classList.remove('.error')
  );

  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.parentElement.querySelector('p').remove();
  }
}

form.addEventListener('submit', renderProgression);

function validateInput(event) {
  if (event.target.value === '') {
    return;
  }
  const parentElement = event.target.parentElement;
  const grandParentElement = parentElement.parentElement;
  const inputValue = event.target.value.replace(',', '.');

  if (
    (!parentElement.classList.contains('error') && isNaN(inputValue)) ||
    Number(inputValue) <= 0
  ) {
    const errorTextElement = document.createElement('p');
    errorTextElement.classList.add('text-red-500');
    errorTextElement.innerText = `Insira um valor numérico e maior do que zero`;

    parentElement.classList.add('error');
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains('error') &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove('error');
    grandParentElement.querySelector('p').remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    formElement.addEventListener('blur', validateInput);
  }
}

clearFormButton.addEventListener('click', clearForm);
