import { generateReturnArray } from './src/investmentGoals.js';

const form = document.getElementById('investiment-form');

function renderProgression(event) {
  event.preventDefault();
  //const startingAmount = Number(form['starting-amount'].value)
  const startingAmount = Number(
    document.getElementById('starting-amount').value
  );
  const additionalContribuition = Number(
    document.getElementById('additional-contribuition').value
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const returnRate = Number(document.getElementById('return-rate').value);
  const taxRate = Number(document.getElementById('tax-rate').value);
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

form.addEventListener('submit', renderProgression);
