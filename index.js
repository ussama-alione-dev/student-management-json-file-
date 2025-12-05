const fs = require("fs");
const prompt = require("prompt-sync")();

const path = "./classe.json";
const raw = fs.readFileSync("./classe.json");
let data = JSON.parse(raw);

const sauvegarderDonnees = () => {
  return fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

const ajouterEleves = () => {
  const nom = prompt("nom d'eleve : ");
  //   const present = prompt("cet eleve est present! : ") === "oui" ? true : false;

  data.push({
    id: crypto.randomUUID(),
    nom,
    present: false,
    competences: {},
  });

  sauvegarderDonnees();

  console.log("Added!");
};

// addStudents();

const marquerPresence = () => {
  const id = prompt("entrer id d'eleve : ");

  const eleve = data.find((el) => el.id === id);
  if (!eleve) {
    console.log("eleve n'existe pas !");
    return;
  }
  console.log(eleve);

  eleve.present =
    prompt("est ce que l'eleve est present (oui / non ) : ") === "oui"
      ? true
      : false;

  sauvegarderDonnees();
};
// marquerPresence();

function ajouterCompetence() {
  const id = prompt("Entrez l'ID de l'élève : ");
  const eleve = data.find((e) => e.id === id);

  if (!eleve) {
    console.log("Élève introuvable !");
    return;
  }

  const nomCompetence = prompt(
    "Nom de la compétence (ex: HTML, JavaScript) : "
  );
  console.log("Niveaux disponibles : Critique, Moyen, Bon, Excellent");
  const niveau = prompt("Niveau de la compétence : ");

  const niveauxValides = ["critique", "moyen", "bon", "excellent"];

  if (!niveauxValides.includes(niveau)) {
    console.log("Niveau invalide !");
    return;
  }

  eleve.competences[nomCompetence] = niveau;
  console.log(
    `Compétence "${nomCompetence}" ajoutée pour ${eleve.nom} avec le niveau "${niveau}"`
  );

  sauvegarderDonnees();
}

// ajouterCompetence();

function afficherFicheEleve() {
  const id = prompt("Entrez l'ID de l'élève : ");
  const eleve = data.find((e) => e.id === id);

  if (!eleve) {
    console.log("Élève introuvable !");
    return;
  }

  console.log(`   FICHE ÉLÈVE #${eleve.id}`);
  console.log(`Nom : ${eleve.nom}`);
  console.log(`Présence : ${eleve.present ? "Présent" : " Absent"}`);
  console.log("Compétences :");

  if (Object.keys(eleve.competences).length === 0) {
    console.log("   Aucune compétence enregistrée");
  } else {
    for (const [comp, niveau] of Object.entries(eleve.competences)) {
      console.log(`${comp}: ${niveau}`);
    }
  }
}

// afficherFicheEleve();

function listerElevesValidants() {
  const elevesValidants = data.filter((eleve) => {
    const competences = Object.values(eleve.competences);

    if (competences.length === 0) return false;

    return competences.every(
      (niveau) => niveau === "Bon" || niveau === "Excellent"
    );
  });

  if (elevesValidants.length === 0) {
    console.log(" Aucun élève validant trouvé");
    return;
  }

  elevesValidants.forEach((eleve) => {
    console.log(`\n ${eleve.nom} (ID: ${eleve.id})`);
    for (const [comp, niveau] of Object.entries(eleve.competences)) {
      console.log(`${comp}: ${niveau}`);
    }
  });
}

// listerElevesValidants();
function chargerDonnees() {
  console.table(data);
}

function afficherMenu() {
  console.log(`
      1. Ajouter un élève
      2. Marquer une présence
      3. Ajouter une compétence
      4. Afficher une fiche élève
      5. Voir les élèves validants
      6. Sauvegarder (écrire dans un fichier JSON)
      7. Charger (lire depuis un fichier JSON)
      8. Quitter
    `);
}

function demarrer() {
  console.log("\n Bienvenue dans le Système de Gestion de Classe!\n");

  while (true) {
    afficherMenu();
    const choix = prompt("Choisissez une option (1-8) : ");
    if (choix === "8") break;

    switch (choix) {
      case "1":
        ajouterEleves();
        break;
      case "2":
        marquerPresence();
        break;
      case "3":
        ajouterCompetence();
        break;
      case "4":
        afficherFicheEleve();
        break;
      case "5":
        listerElevesValidants();
        break;
      case "6":
        sauvegarderDonnees();
        break;
      case "7":
        chargerDonnees();
        break;

      default:
        console.log("Option invalide !");
    }
  }
}

// Démarrer l'application
demarrer();
