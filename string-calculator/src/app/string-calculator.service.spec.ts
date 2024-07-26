import { TestBed } from '@angular/core/testing';
import { StringCalculatorService } from './string-calculator.service';

describe('StringCalculatorService', () => {
  let service: StringCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringCalculatorService);
  });

  it('should return 0 for an empty string', () => {
    expect(service.add('')).toEqual(0);
  });

  it('should return 1 for input "1"', () => {
    expect(service.add('1')).toEqual(1);
  });

  it('should return 3 for input "1,2"', () => {
    expect(service.add('1,2')).toEqual(3);
  });

  it('should handle multiple numbers', () => {
    expect(service.add('1,2,3,4')).toEqual(10);
  });

  it('should handle new lines between numbers', () => {
    expect(service.add('1\n2,3')).toEqual(6);
  });

  it('should support different delimiters', () => {
    expect(service.add('//;\n1;2')).toEqual(3);
  });

  it('should throw an exception for negative numbers', () => {
    expect(() => service.add('1,-2')).toThrow(new Error('negatives not allowed: -2'));
  });

  it('should show all negative numbers in the exception message', () => {
    expect(() => service.add('1,-2,-3')).toThrow(new Error('negatives not allowed: -2,-3'));
  });

  it('should count the number of times add() was called', () => {
    service.add('');
    service.add('1');
    expect(service.getCalledCount()).toEqual(2);
  });

  it('should trigger AddOccured event after add() is called', () => {
    let receivedInput = '';
    let receivedResult = 0;

    service.addOccured.subscribe((data: { input: string, result: number }) => {
      receivedInput = data.input;
      receivedResult = data.result;
    });

    service.add('1,2');
    expect(receivedInput).toBe('1,2');
    expect(receivedResult).toBe(3);
  });

  it('should ignore numbers bigger than 1000', () => {
    expect(service.add('2,1001')).toEqual(2);
  });

  it('should support delimiters of any length', () => {
    expect(service.add('//[***]\n1***2***3')).toEqual(6);
  });

  it('should support multiple delimiters', () => {
    expect(service.add('//[*][%]\n1*2%3')).toEqual(6);
  });

  it('should support multiple delimiters with length longer than one char', () => {
    expect(service.add('//[**][%%]\n1**2%%3')).toEqual(6);
  });
});
