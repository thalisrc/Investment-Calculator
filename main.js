import { generateReturnArray } from './src/investmentGoals.js';
import Chart from 'chart.js/auto';
import { createTable } from './src/table.js';

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
const form = document.getElementById('investiment-form');
const clearFormButton = document.getElementById('clear-form');
let progressionChartReference = {};
let donnutReference = {};

const columnsArray = [
  { columnLabel: 'Mês', accessor: 'month' },
  {
    columnLabel: 'Total Investido',
    accessor: 'investedAmount',
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: 'Rendimento Mensal',
    accessor: 'interestReturns',
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: 'Rendimento total',
    accessor: 'totalInterestReturns',
    format: (numberInfo) => formatCurrency(numberInfo),
  },
  {
    columnLabel: 'Quantia total',
    accessor: 'totalAmount',
    format: (numberInfo) => formatCurrency(numberInfo),
  },
];

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

function renderProgression(event) {
  event.preventDefault();
  if (document.querySelector('.error')) {
    return;
  }

  resetCharts();
  //const startingAmount = Number(form['starting-amount'].value)
  const startingAmount = Number(
    document.getElementById('starting-amount').value.replace(',', '.')
  );
  const additionalContribuition = Number(
    document.getElementById('additional-contribuition').value.replace(',', '.')
  );
  const timeAmount = Number(document.getElementById('time-amount').value);
  const returnRate = Number(
    document.getElementById('return-rate').value.replace(',', '.')
  );
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

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  donnutReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total Investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investObject) => investObject.month),
      datasets: [
        {
          label: 'Total Investido',
          data: returnsArray.map((investObject) =>
            formatCurrencyToGraph(investObject.investedAmount)
          ),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Retorno de Investimento',
          backgroundColor: 'rgb(54, 162, 235)',
          data: returnsArray.map((investObject) =>
            formatCurrencyToGraph(investObject.interestReturns)
          ),
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });

  createTable(columnsArray, returnsArray, 'results-table');
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(donnutReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    donnutReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form['starting-amount'].value = '';
  form['additional-contribuition'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';
  resetCharts();

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

const mainEl = document.querySelector('main');
const cauroselEl = document.getElementById('carousel');
const nextButton = document.getElementById('slide-arrow-next');
const previousButton = document.getElementById('slide-arrow-previous');

nextButton.addEventListener('click', () => {
  cauroselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener('click', () => {
  cauroselEl.scrollLeft -= mainEl.clientWidth;
});
