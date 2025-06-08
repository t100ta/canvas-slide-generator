import { debounce } from '../src/utils.js';

jest.useFakeTimers();

test('debounce executes after wait', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 100);
  debounced();
  debounced();
  expect(fn).not.toBeCalled();
  jest.advanceTimersByTime(100);
  expect(fn).toBeCalledTimes(1);
});
