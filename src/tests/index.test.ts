import path from 'path';
import fs from 'fs';

import extract, { Options } from '../extract';

describe('extract', () => {
  it('should throw an error when filePath argument is not specified', () => {
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
    const fsSpy = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => true);

    beforeEach(() => {
      fsSpy.mockClear();
    });

    it('should create files', () => {
      extract(path.join(__dirname, 'files/test2.html'));

      expect(fsSpy).toHaveBeenCalledTimes(2);
    });

    it('should return an object', () => {
      const options: Options = {
        out: 'object'
      };

      expect(
        typeof extract(path.join(__dirname, 'files/test2.html'), options)
      ).toBe('object');
      expect(fsSpy).not.toHaveBeenCalled();
    });
  });
});
