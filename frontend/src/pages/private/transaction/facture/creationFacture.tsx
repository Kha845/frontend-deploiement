// import React, { useState } from "react";
// import { Button, Stepper, Step, StepLabel, Typography } from "@mui/material";
// import { useStore } from "../../../../store/rootStore";
// import FactureStockeur from "./factureStockeur";
// import FactureAvecPassageEtFrais from "./factureAvecPassageEtFrais";


// // Définition du type Designation pour la facture
// type DesignationFacture = {
//     designation: string; // Nom de l'article ou carburant
//     quantite: number;    // Quantité
//     prixUnitaire: number; // Prix par unité
//     montant: number;     // Montant total
//     devise: string;      // Devise utilisée (e.g., EUR, USD)
// };

// // Définition du type des données pour la facture
// type FactureData = {
//     reference: string;
//     idStockeur?: number;
//     etat?: string;
//     UniteDeMesure: string;
//     date: string | Date; // Utilisez `Date` si vous travaillez avec des objets Date
//     idModePaiement?: number;
//     temperature?: string;
//     designations?: DesignationFacture[];
// };

// // Définition du type Designation pour les frais de passage
// type DesignationPassage = {
//     designation: string; // Nom de l'article ou carburant
//     volume_ambiant: number;    
//     volume_a_15_kg: number; 
//     taux_blanc: number;     
//     taux_noir: number;
//     montant_blanc: number;
//     montant_noir: number;
// };

// // Définition du type pour les frais de passage
// interface FraisPassage {
//     cumul_cfa_noir: number;
//     cumul_cfa_blanc: number;
//     designations: DesignationPassage[];
// }

// const FactureCreation = () => {
//     const [activeStep, setActiveStep] = useState(0);
//     const [factureData, setFactureData] = useState<FactureData | null>(null);
//     const [fraisPassageData, setFraisPassageData] = useState<FraisPassage[]>([]);
//     const { rootStore: { factureStore } } = useStore();
//     const { createData } = factureStore;

//     const steps = ["Créer une Facture", "Ajouter des Frais de Passage"];

//     const handleNext = () => {
//         if (activeStep === 0 && !factureData) {
//             alert("Veuillez remplir les données de la facture avant de continuer.");
//             return;
//         }
//         setActiveStep((prevStep) => prevStep + 1);
//     };

//     const handleBack = () => {
//         setActiveStep((prevStep) => prevStep - 1);
//     };

//     const handleSubmit = async () => {
//         if (!fraisPassageData || fraisPassageData.length === 0) {
//             alert("Veuillez ajouter les frais de passage avant de soumettre.");
//             return;
//         }
//         try {
//             const combinedData = { facture: factureData, fraisPassage: fraisPassageData };
//             await createData(combinedData);
//             alert("Facture et frais de passage enregistrés avec succès !");
//             setActiveStep(0);
//             setFactureData(null);
//             setFraisPassageData([]);
//         } catch (error) {
//             console.error("Erreur lors de l'enregistrement :", error);
//             alert("Une erreur s'est produite. Veuillez réessayer.");
//         }
//     };

//     return (
//         <div>
//             <Typography variant="h4" gutterBottom color='success' textAlign='center'>
//                 Enregistrement d'une nouvelle facture stockeur  et Frais de Passage
//             </Typography>

//             <Stepper activeStep={activeStep} style={{ marginBottom: "20px",marginLeft:'200px' }}>
//                 {steps.map((label) => (
//                     <Step key={label}>
//                         <StepLabel>{label}</StepLabel>
//                     </Step>
//                 ))}
//             </Stepper>

//             {activeStep === 0 && (
//                 <FactureStockeur
//                     onChange={setFactureData}
//                     onSubmit={handleNext}
//                 />
//             )}
//             {activeStep === 1 && (
//                 <FactureAvecPassageEtFrais
//                     onChange={setFraisPassageData}
//                     onSubmit={handleSubmit}
//                 />
//             )}

//             <div style={{ marginTop: 20 }}>
//                 {activeStep > 0 && (
//                     <Button onClick={handleBack} variant="outlined">
//                         Retour
//                     </Button>
//                 )}
//                 {activeStep < steps.length - 1 && (
//                     <Button
//                         onClick={handleNext}
//                         variant="contained"
//                         color="primary"
//                         disabled={!factureData}
//                         style={{ marginLeft: 10 }}
//                     >
//                         Suivant
//                     </Button>
//                 )}
//                 {activeStep === steps.length - 1 && (
//                     <Button
//                         onClick={handleSubmit}
//                         variant="contained"
//                         color="success"
//                         style={{ marginLeft: 10 }}
//                     >
//                         Soumettre
//                     </Button>
//                 )}
//                 <Button
//                     onClick={() => setActiveStep(0)}
//                     variant="outlined"
//                     color="secondary"
//                     style={{ marginLeft: 10 }}
//                 >
//                     Réinitialiser
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default FactureCreation;
