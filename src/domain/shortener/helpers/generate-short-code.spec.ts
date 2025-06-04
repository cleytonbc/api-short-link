import { describe, it, expect } from 'vitest';
import { generateShortCode } from '../helpers/generate-short-code';

describe('generateShortCode', () => {
  it('Deve gerar um código com comprimento de 6 caracteres como padrão', () => {
    const code = generateShortCode();
    expect(code).toHaveLength(6);
  });

  it('Deve gerar um código com o comprimento passado no parâmetro', () => {
    const length = 10;
    const code = generateShortCode(length);
    expect(code).toHaveLength(length);
  });

  it('Deve ter somente carácteres válidos no código gerado', () => {
    const code = generateShortCode(20);
    const charset = /^[A-Za-z0-9\-_]+$/;
    expect(code).toMatch(charset);
  });
});
