import StyleDictionary from 'style-dictionary';

// 1. Registrar transformación para convertir dimensiones (números de Figma) a unidades rem
StyleDictionary.registerTransform({
  name: 'size/pxToRem',
  type: 'value',
  matcher: (token) => token.type === 'dimension' && typeof token.value === 'number',
  transform: (token) => { // <-- Se cambió 'transformer' por 'transform' para SD v5
    if (token.value === 0) return '0';
    return `${token.value / 16}rem`;
  }
});

// 2. Configurar la compilación de Style Dictionary
const sd = new StyleDictionary({
  source: ['tokens/tokens.json'], // Verifica que esta sea la ruta exacta de tu JSON
  platforms: {
    css: {
      transforms: ['attribute/cti', 'name/kebab', 'size/pxToRem'],
      buildPath: 'src/styles/generated/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true // Preserva las referencias como var(--primitives-...)
          }
        }
      ]
    }
  }
});

// 3. Ejecutar el build
await sd.buildAllPlatforms();
console.log('✨ Tokens generados con éxito en src/styles/generated/tokens.css');