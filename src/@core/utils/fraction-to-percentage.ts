export function fractionToPercentage(numerator: number, denominator: number): number {
	const percentage = (numerator/denominator) * 100;

	return parseInt(percentage.toFixed(0));
}
