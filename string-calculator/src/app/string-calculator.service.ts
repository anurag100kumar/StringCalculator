import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringCalculatorService {
  private callCount = 0;
  public addOccured = new EventEmitter<{ input: string, result: number }>();

  constructor() {}

  add(numbers: string): number {
    this.callCount++;

    if (!numbers) {
      this.addOccured.emit({ input: numbers, result: 0 });
      return 0;
    }

    let delimiter = /,|\n/;
    if (numbers.startsWith('//')) {
      const delimiterSectionEnd = numbers.indexOf('\n');
      const delimiterSection = numbers.substring(2, delimiterSectionEnd);
      numbers = numbers.substring(delimiterSectionEnd + 1);

      if (delimiterSection.startsWith('[') && delimiterSection.endsWith(']')) {
        const delimiters = delimiterSection.slice(1, -1).split('][');
        delimiter = new RegExp(delimiters.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'));
      } else {
        delimiter = new RegExp(delimiterSection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      }
    }

    const numArray = numbers
      .split(delimiter)
      .map(num => parseInt(num, 10))
      .filter(num => !isNaN(num) && num <= 1000);

    const negativeNumbers = numArray.filter(num => num < 0);
    if (negativeNumbers.length) {
      throw new Error(`negatives not allowed: ${negativeNumbers.join(',')}`);
    }

    const result = numArray.reduce((sum, num) => sum + num, 0);
    this.addOccured.emit({ input: numbers, result });
    return result;
  }

  getCalledCount(): number {
    return this.callCount;
  }
}
