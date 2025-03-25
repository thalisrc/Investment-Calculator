function convertToMonthlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

export function generateReturnArray(
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = 'monthly',
  monthlyContrabution = 0,
  returnRate = 0,
  returnTimeFrame = 'monthly'
) {
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      'Investimento inicial e prazo devem ser preenchidos com valores positivos'
    );
  }
  const finalReturnRate =
    returnTimeFrame === 'monthly'
      ? 1 + returnRate / 100
      : convertToMonthlyReturnRate(1 + returnRate / 100);

  const timeFinalTimeHorizon =
    timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;

  const referenceinvestmentObject = {
    investedAmount: startingAmount,
    interestReturns: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };

  const returnsArray = [referenceinvestmentObject];
  for (
    let timeReference = 1;
    timeReference <= timeFinalTimeHorizon;
    timeReference++
  ) {
    const totalAmount =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate +
      monthlyContrabution;
    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate;
    const investedAmount = startingAmount + monthlyContrabution * timeReference;
    const totalInterestReturns = totalAmount - investedAmount;
    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount,
    });
  }
  return returnsArray;
}
