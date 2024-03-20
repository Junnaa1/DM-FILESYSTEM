import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const totalsFile = path.join(__dirname, 'salesTotals', 'totals.txt');

// Suppression du fichier totals.txt pour simplifier la réalisation des tests
async function deleteFile() {
    try {
        await fs.unlink(totalsFile);
        console.log('Totals.txt deleted');
    } catch (err) {
        console.error('Error:', err);
    }
}

deleteFile();