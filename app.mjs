// Modules

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Variables pour accéder aux fichiers et dossiers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storesDirectory = path.join(__dirname, process.argv[2] || 'stores');  // Gère tous les dossiers de stores ou d'un chemin précis passé en argument
const salesTotalsDirectory = path.join(__dirname, 'salesTotals'); // Crée un dossier salesTotals
const totalsFile = path.join(__dirname, 'salesTotals', 'totals.txt');

async function calculateTotal() {
    let totalSum = 0;
    async function processDirectory(directory) {    // Fonction asynchrone pour traiter les dossiers jusqu'à la fin
        let files = await fs.readdir(directory, { withFileTypes: true }); // 
        for (let file of files) {
            let fullPath = path.join(directory, file.name);
            if(file.isDirectory()) {
                await processDirectory(fullPath); // L'asynchronité permet de chercher dans les dossiers jusqu'au dernier
            } else if(path.extname(file.name) === '.json') {    // Si le fichier est un fichier JSON alors on le lit
                let data = await fs.readFile(fullPath);
                let json = JSON.parse(data);
                totalSum += json.total;     // On ajoute le total de chaque fichier JSON au total général
            }
        }
    }

    await processDirectory(storesDirectory); 

    // Création du message à écrire dans le fichier totals.txt (date et total général)
    let date = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
    let message = `Total at ${date} from ${process.argv[2] || 'stores'}: ${totalSum}€\n`;

    // Gestion de l'existence du fichier totals.txt dans la console
    let fileExists = false;
    try {
        await fs.access(totalsFile);
        fileExists = true;
    } catch {}

    // Création du dossier "salesTotals" si nécessaire
    await fs.mkdir(salesTotalsDirectory, { recursive: true });

    await fs.appendFile(totalsFile, message);   // Append pour faire une liste des totaux entrés
    if (fileExists) {
        console.log(`salesTotals already exists. Wrote sales totals ${totalSum}€ to salesTotals`);
    } else {
        console.log(`Wrote sales totals ${totalSum}€ to salesTotals`);
    }
}

calculateTotal().catch(console.error);