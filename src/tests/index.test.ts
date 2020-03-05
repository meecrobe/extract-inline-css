import path from 'path';
import fs from 'fs';

import extract, { Options } from '../index';

describe('extract', () => {
  it('should throw an error when no filePath argument is not specified', () => {
    expect(() => {
      // @ts-ignore
      extract();
    }).toThrowError();
  });

  it('should throw an error when file does not exist', () => {
    expect(() => {
      extract(path.join(__dirname, 'files/not-exist.html'));
    }).toThrowError();
  });

  it('should print warning', () => {
    const consoleWarnSpy = jest.spyOn(global.console, 'warn');

    extract(path.join(__dirname, 'files/test1.html'));

    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  describe('options', () => {
    jest.mock('fs');
    // @ts-ignore
    fs.writeFileSync.mockReturnValue(true);

    beforeEach(() => {
      // @ts-ignore
      fs.writeFileSync.mockClear();
    });

    it('should create files', () => {
      extract(path.join(__dirname, 'files/test2.html'));

      expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    });

    it('should return an object', () => {
      const options: Options = {
        out: 'object'
      };

      expect(
        typeof extract(path.join(__dirname, 'files/test2.html'), options)
      ).toBe('object');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
