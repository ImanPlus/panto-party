export const addToNumber = (currentNumber: unknown, amount: number) => {
  if (typeof currentNumber !== "number") {
    return amount
  }

  return currentNumber + amount
}