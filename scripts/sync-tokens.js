import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

const FIGMA_TOKEN = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FILE_KEY) {
  console.error('❌ Falta FIGMA_PERSONAL_ACCESS_TOKEN o FIGMA_FILE_KEY en el archivo .env');
  process.exit(1);
}

async function fetchFigmaVariables() {
  console.log('🔄 Conectando con la API de Figma...');
  const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Error en la API de Figma: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.meta;
}

async function run() {
  try {
    const meta = await fetchFigmaVariables();
    const { variableCollections, variables } = meta;

    console.log(`✅ Se encontraron ${Object.keys(variableCollections).length} colecciones y ${Object.keys(variables).length} variables.`);

    // Creamos la carpeta base /tokens
    await fs.mkdir(path.join(process.cwd(), 'tokens'), { recursive: true });

    // Guardamos la respuesta cruda de diagnóstico por si queremos inspeccionarla
    await fs.writeFile(
      path.join(process.cwd(), 'tokens', 'figma-dump.json'),
      JSON.stringify(meta, null, 2)
    );

    console.log('🎉 Extracción completada con éxito. Revisa la carpeta /tokens.');
  } catch (error) {
    console.error('❌ Error al sincronizar tokens:', error.message);
  }
}

run();