import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, Select, TableRow, Button, MenuItem, TextField, IconButton } from '@mui/material';
import { useStore } from '../../../../store/rootStore';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, subMonths, startOfMonth, endOfMonth, } from 'date-fns'; // Librairie pour formater les dates
import { fr } from 'date-fns/locale';
type RowDataType = {
  date: string | null;
  type: string;
  temperature_initial: string | number | null;
  quantiteInitiale: number;
  quantiteEntree: number;
  quantiteSortie: number;
  quantiteReelle: number;
  quantiteTheorique: number;
  ecart: number;
  montantTheorique: number;
  montantReel: number;
  prixUnitaire: number;
  unite: string | null;
  dateEntree: string | null;
  dateSortie: string | null;
};
const DetailsStock = () => {
  const { rootStore: { senStockStore } } = useStore();
  const [month, setMonth] = useState('');  // Mois sélectionné pour les donnée
  const [interval, setInterval] = useState({ start: '', end: '' });  // Sélection de l'intervalle (date de début et de fin)
  const navigate = useNavigate();
  const [quantiteInitial, setQuantiteInitial] = useState(0);
  // const [temperature_initial, setTemperature_initial] = useState(0);
  // const [temperature_final, setTemperature_final] = useState(0);
  // Définir l'état totalsQuantite
  const [totalsQuantite, setTotalsQuantite] = useState({
    Gazoil: {
      initial: 0,
      entree: 0,
      sortie: 0,
      reelle: 0,
      theorique: 0,
      ecart: 0,
      montantTheorique: 0,
      montantReel: 0,
      prixUnitaire: 755,
    },
    Diesel: {
      initial: 0,
      entree: 0,
      sortie: 0,
      reelle: 0,
      theorique: 0,
      ecart: 0,
      montantTheorique: 0,
      montantReel: 0,
      prixUnitaire: 755,
    },
    Super: {
      initial: 0,
      entree: 0,
      sortie: 0,
      reelle: 0,
      theorique: 0,
      ecart: 0,
      montantTheorique: 0,
      montantReel: 0,
      prixUnitaire: 990,
    },
  });
  // const [filteredTotals, setFilteredTotals] = useState(Object.entries(totalsQuantite));
  // Fonction pour calculer la quantité corrigée
  const calculateCorrectedQuantity = (quantiteMesuree: number, alpha: number, temperatureMesuree: number) => {
    const deltaT = 25 - temperatureMesuree;
    return quantiteMesuree * (1 + alpha * deltaT);
  };
  const convertToLitres = (quantite: number, uniteDeMesure: string): number => {
    switch (uniteDeMesure) {
      case "litre":
        return quantite; // Déjà en litres
      case "hectolitre":
        return quantite * 100; // 1 hectolitre = 100 litres
      case "metre cube":
        return quantite * 1000; // 1 mètre cube = 1000 litres
      case "tonne":
        return quantite * 1000; // 1 tonne = 1000 litres
      default:
        console.warn(`Unité inconnue: ${uniteDeMesure}, retour à 0.`);
        return 0; // Par défaut, retourne 0 pour les unités non reconnues
    }
  };

  const initTable = async () => {
    try {
      // Calculer les dates du mois précédent
      const today = new Date();
      const startDateOfPreviousMonth = startOfMonth(subMonths(today, 1)); // Premier jour du mois précédent
      const endDateOfPreviousMonth = endOfMonth(subMonths(today, 1)); // Dernier jour du mois précédent
      const data = await senStockStore.getDataLastMonthStateStock();

      if (!data || !data.quantites_initiales || !data.quantites_entrees || !data.quantites_sorties) {
        console.error("Les données récupérées sont vides ou invalides:", data);
        return;
      }
      // Filtrer les données du mois précédent
      const filterDataForMonth = (data: any, startDate: any, endDate: any) => {
        return data.filter((item: any) => {
          const itemDate = new Date(item.date); // Assurez-vous que `item.date` est au bon format
           setMonth(format(new Date(startDate), "MMMM yyyy", { locale: fr }));
          return itemDate >= startDate && itemDate <= endDate;
        });
      };

      // Calculer les totaux pour le mois précédent en filtrant les entrées et sorties
      const quantitesInitialesFiltered = filterDataForMonth(data.quantites_initiales, startDateOfPreviousMonth, endDateOfPreviousMonth);
      const quantitesEntreesFiltered = filterDataForMonth(data.quantites_entrees, startDateOfPreviousMonth, endDateOfPreviousMonth);
      const quantitesSortiesFiltered = filterDataForMonth(data.quantites_sorties, startDateOfPreviousMonth, endDateOfPreviousMonth);
      const prixUnitaire = { Gazoil: 755, Diesel: 755, Super: 990 };
      const alphaRanges = {
        Gazoil: { min: 0.0006, max: 0.0008 },
        Diesel: { min: 0.0006, max: 0.0008 },
        Super: { min: 0.0009, max: 0.0011 },
      };
      // const referenceTemperature = 15; // Température standard

      const transformedData: RowDataType[] = [];

      // Calcul des totaux
      const newTotalsQuantite = {
        Gazoil: {
          initial: 0,
          entree: 0,
          sortie: 0,
          reelle: 0,
          theorique: 0,
          ecart: 0,
          montantTheorique: 0,
          montantReel: 0,
          prixUnitaire: prixUnitaire.Gazoil,
        },
        Diesel: {
          initial: 0,
          entree: 0,
          sortie: 0,
          reelle: 0,
          theorique: 0,
          ecart: 0,
          montantTheorique: 0,
          montantReel: 0,
          prixUnitaire: prixUnitaire.Diesel,
        },
        Super: {
          initial: 0,
          entree: 0,
          sortie: 0,
          reelle: 0,
          theorique: 0,
          ecart: 0,
          montantTheorique: 0,
          montantReel: 0,
          prixUnitaire: prixUnitaire.Super,
        },
      };

      // Traiter les quantités initiales
      quantitesInitialesFiltered.forEach((initialItem: any) => {
        const typeCarburants = ["Gazoil", "Diesel", "Super"];

        typeCarburants.forEach((type) => {
          const quantiteInitialeRaw =
            type === "Diesel"
              ? initialItem.quantite_diesel_initiale
              : type === "Gazoil"
                ? initialItem.quantite_gazoil_initiale
                : initialItem.quantite_super_initiale;

          const quantiteInitiale = convertToLitres(quantiteInitialeRaw, initialItem.uniteDeMesure);
          setQuantiteInitial(quantiteInitial);
          newTotalsQuantite[type as keyof typeof newTotalsQuantite].initial += quantiteInitiale; // Ajouter à la quantité initiale

          transformedData.push({
            date: initialItem.date || null,
            type,
            temperature_initial: 15,
            quantiteInitiale: quantiteInitiale,
            quantiteEntree: 0,
            quantiteSortie: 0,
            quantiteReelle: 0,
            quantiteTheorique: quantiteInitiale,
            ecart: 0,
            montantTheorique: quantiteInitiale * prixUnitaire[type as keyof typeof prixUnitaire], // Calculer le montant théorique
            montantReel: 0,  // Montant réel initialement à 0
            prixUnitaire: prixUnitaire[type as keyof typeof prixUnitaire],
            unite: initialItem.unite || null,
            dateEntree: null,
            dateSortie: initialItem.date || null
          });
        });
      });

      // Traiter les quantités entrées
      quantitesEntreesFiltered.forEach((entreeItem: any) => {
        const typeCarburants = ["Gazoil", "Diesel", "Super"];
        typeCarburants.forEach((type) => {
          // 1. Extraire les données
          const quantiteEntreeRaw = entreeItem[`quantite_${type.toLowerCase()}_entree`] || 0;
          const quantiteEntree = convertToLitres(quantiteEntreeRaw, entreeItem.uniteDeMesure);
        
          // 2. Vérifier les températures
          const temperatureEntree = parseFloat(entreeItem.temperature_initial) ;
         
          console.log('temperature entree', entreeItem.temperature_initial);
        
          const alpha = (alphaRanges[type as keyof typeof alphaRanges]?.min + alphaRanges[type as keyof typeof alphaRanges]?.max) / 2 || 0.00065;
        
          // 4. Calculer les quantités
          const quantiteTheorique = quantiteInitial + quantiteEntree;
        
          const quantiteReelEntree = calculateCorrectedQuantity(quantiteEntree, alpha, temperatureEntree);
         
          newTotalsQuantite[type as keyof typeof newTotalsQuantite].reelle += quantiteReelEntree;
      
          console.log(`Quantité réelle après mise à jour pour ${type} :`, newTotalsQuantite[type as keyof typeof newTotalsQuantite].reelle);
          // 5. Calculer l'écart
          const quantiteEcart = quantiteTheorique - quantiteReelEntree;
        
          // 6. Calculer le montant réel
          const montantReel = quantiteReelEntree * prixUnitaire[type as keyof typeof prixUnitaire];
        
          // 7. Mettre à jour les totaux
          newTotalsQuantite[type as keyof typeof newTotalsQuantite].entree += quantiteEntree;
          newTotalsQuantite[type as keyof typeof newTotalsQuantite].ecart += quantiteEcart;
        
          // 8. Mettre à jour transformedData
          const existingRow = transformedData.find((row) => row.type === type);
          if (existingRow) {
            existingRow.quantiteEntree += quantiteEntree;
            existingRow.quantiteTheorique += quantiteTheorique;
            existingRow.quantiteReelle += quantiteReelEntree;
            existingRow.ecart += quantiteEcart;
            existingRow.montantReel += montantReel;
          } else {
            transformedData.push({
              date: entreeItem.date || null,
              type,
              temperature_initial: temperatureEntree,
              quantiteInitiale: quantiteInitial,
              quantiteEntree,
              quantiteSortie: 0,
              quantiteReelle: quantiteReelEntree,
              quantiteTheorique,
              ecart: quantiteEcart,
              montantTheorique: quantiteTheorique * prixUnitaire[type as keyof typeof prixUnitaire],
              montantReel,
              prixUnitaire: prixUnitaire[type as keyof typeof prixUnitaire],
              unite: entreeItem.unite || null,
              dateEntree: entreeItem.date || null,
              dateSortie: null,
            });
          }
        });    
      });

      // Boucle sur les quantités sorties
      quantitesSortiesFiltered.forEach((sortieItem: any) => {
        const typeCarburants = ["Gazoil", "Diesel", "Super"];
        typeCarburants.forEach((type) => {
          const quantiteSortieRaw = sortieItem[`quantite_${type.toLowerCase()}_sortie`] || 0;
          const quantiteSortie = convertToLitres(quantiteSortieRaw, sortieItem.uniteDeMesure);

          newTotalsQuantite[type as keyof typeof newTotalsQuantite].sortie += quantiteSortie;

          const quantiteTheorique = newTotalsQuantite[type as keyof typeof newTotalsQuantite].initial +
                                    newTotalsQuantite[type as keyof typeof newTotalsQuantite].entree -
                                    newTotalsQuantite[type as keyof typeof newTotalsQuantite].sortie;

          const existingRow = transformedData.find((row) => row.type === type);
          if (existingRow) {
            existingRow.quantiteSortie += quantiteSortie;
            existingRow.quantiteTheorique = quantiteTheorique;
            const quantiteEcart = quantiteTheorique - existingRow.quantiteReelle;
            existingRow.ecart = quantiteEcart;
            existingRow.montantReel = existingRow.quantiteReelle * prixUnitaire[type as keyof typeof prixUnitaire];
          }
        });
      });

      // Calculer les totaux
      Object.keys(newTotalsQuantite).forEach((type) => {
        const key = type as keyof typeof newTotalsQuantite;
        const totaux = newTotalsQuantite[key];

        if (totaux.initial >= 0 && totaux.entree >= 0 && totaux.sortie >= 0) {
          totaux.theorique = totaux.initial + totaux.entree - totaux.sortie;
          totaux.ecart = totaux.reelle - totaux.theorique;
          totaux.montantTheorique = totaux.theorique * totaux.prixUnitaire;
          totaux.montantReel = totaux.reelle * totaux.prixUnitaire;
          console.log(`Quantités pour ${key} :`, totaux);
        } else {
          console.warn(`Données invalides pour le carburant ${key}`);
        }
      });

      setTotalsQuantite(newTotalsQuantite);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la table:", error);
    }
  };
  const handleDateRangeChange = async (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    setInterval({ start, end });

    // Récupération des données via l'API
    const data = await senStockStore.getDataLastMonthStateStock();

    if (!data || !data.quantites_initiales || !data.quantites_entrees || !data.quantites_sorties) {
      console.error("Les données récupérées sont vides ou invalides:", data);
      return;
    }
    // Fonction utilitaire : Filtrer les données par intervalle de dates
    const filterDataByDateRange = (dataArray: any[], start: Date, end: Date) => {
      return dataArray.filter((item) => {
        const date = new Date(start);  // Récupérer la date du premier élément filtré
        setMonth(format(new Date(date), "MMMM yyyy", { locale: fr }));
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end; // Garder uniquement les éléments dans l'intervalle
      });
    };
    // Filtrer les données par intervalle de dates
    const quantitesInitialesFiltered = filterDataByDateRange(data.quantites_initiales, startDate, endDate);
    const quantitesEntreesFiltered = filterDataByDateRange(data.quantites_entrees, startDate, endDate);
    const quantitesSortiesFiltered = filterDataByDateRange(data.quantites_sorties, startDate, endDate);

    // Configuration initiale des totaux et constantes
    const prixUnitaire = { Gazoil: 755, Diesel: 755, Super: 990 };
    const alphaRanges = {
      Gazoil: { min: 0.0006, max: 0.0008 },
      Diesel: { min: 0.0006, max: 0.0008 },
      Super: { min: 0.0009, max: 0.0011 },
    };

    const newTotalsQuantite = {
      Gazoil: { initial: 0, entree: 0, sortie: 0, reelle: 0, theorique: 0, ecart: 0, montantTheorique: 0, montantReel: 0, prixUnitaire: prixUnitaire.Gazoil },
      Diesel: { initial: 0, entree: 0, sortie: 0, reelle: 0, theorique: 0, ecart: 0, montantTheorique: 0, montantReel: 0, prixUnitaire: prixUnitaire.Diesel },
      Super: { initial: 0, entree: 0, sortie: 0, reelle: 0, theorique: 0, ecart: 0, montantTheorique: 0, montantReel: 0, prixUnitaire: prixUnitaire.Super },
    };
    const transformedData: RowDataType[] = [];
    // Traiter les quantités initiales
     // Traiter les quantités initiales
     quantitesInitialesFiltered.forEach((initialItem: any) => {
      const typeCarburants = ["Gazoil", "Diesel", "Super"];

      typeCarburants.forEach((type) => {
        const quantiteInitialeRaw =
          type === "Diesel"
            ? initialItem.quantite_diesel_initiale
            : type === "Gazoil"
              ? initialItem.quantite_gazoil_initiale
              : initialItem.quantite_super_initiale;

        const quantiteInitiale = convertToLitres(quantiteInitialeRaw, initialItem.uniteDeMesure);
        setQuantiteInitial(quantiteInitial);
        newTotalsQuantite[type as keyof typeof newTotalsQuantite].initial += quantiteInitiale; // Ajouter à la quantité initiale
        // console.log('temperature finale', temperatureInitial);
        // setTemperature_final(temperatureInitial)
        transformedData.push({
          date: initialItem.date || null,
          type,
          temperature_initial: 15,
          quantiteInitiale: quantiteInitiale,
          quantiteEntree: 0,
          quantiteSortie: 0,
          quantiteReelle: 0,
          quantiteTheorique: quantiteInitiale,
          ecart: 0,
          montantTheorique: quantiteInitiale * prixUnitaire[type as keyof typeof prixUnitaire], // Calculer le montant théorique
          montantReel: 0,  // Montant réel initialement à 0
          prixUnitaire: prixUnitaire[type as keyof typeof prixUnitaire],
          unite: initialItem.unite || null,
          dateEntree: null,
          dateSortie: initialItem.date || null
        });
      });
    });

    // Traiter les quantités entrées
    quantitesEntreesFiltered.forEach((entreeItem: any) => {
      const typeCarburants = ["Gazoil", "Diesel", "Super"];
      typeCarburants.forEach((type) => {
        // 1. Extraire les données
        const quantiteEntreeRaw = entreeItem[`quantite_${type.toLowerCase()}_entree`] || 0;
        const quantiteEntree = convertToLitres(quantiteEntreeRaw, entreeItem.uniteDeMesure);
      
        // 2. Vérifier les températures
        const temperatureEntree = parseFloat(entreeItem.temperature_initial) ;
        // const temperatureFinale = parseFloat(entreeItem.temperature_final) || 15;
        console.log('temperature entree', entreeItem.temperature_initial);
        // console.log('temperature final', entreeItem.temperatureFinale);
        // 3. Calculer alpha
        const alpha = (alphaRanges[type as keyof typeof alphaRanges]?.min + alphaRanges[type as keyof typeof alphaRanges]?.max) / 2 || 0.00065;
      
        // 4. Calculer les quantités
        const quantiteTheorique = quantiteInitial + quantiteEntree;
        
        const quantiteReelEntree = calculateCorrectedQuantity(quantiteEntree, alpha, temperatureEntree);
       
        newTotalsQuantite[type as keyof typeof newTotalsQuantite].reelle += quantiteReelEntree;
    
        console.log(`Quantité réelle après mise à jour pour ${type} :`, newTotalsQuantite[type as keyof typeof newTotalsQuantite].reelle);
        // 5. Calculer l'écart
        const quantiteEcart = quantiteTheorique - quantiteReelEntree;
      
        // 6. Calculer le montant réel
        const montantReel = quantiteReelEntree * prixUnitaire[type as keyof typeof prixUnitaire];
      
        // 7. Mettre à jour les totaux
        newTotalsQuantite[type as keyof typeof newTotalsQuantite].entree += quantiteEntree;
        newTotalsQuantite[type as keyof typeof newTotalsQuantite].ecart += quantiteEcart;
      
        // 8. Mettre à jour transformedData
        const existingRow = transformedData.find((row) => row.type === type);
        if (existingRow) {
          existingRow.quantiteEntree += quantiteEntree;
          existingRow.quantiteTheorique += quantiteTheorique;
          existingRow.quantiteReelle += quantiteReelEntree;
          existingRow.ecart += quantiteEcart;
          existingRow.montantReel += montantReel;
        } else {
          transformedData.push({
            date: entreeItem.date || null,
            type,
            temperature_initial: 15,
            quantiteInitiale: quantiteInitial,
            quantiteEntree,
            quantiteSortie: 0,
            quantiteReelle: quantiteReelEntree,
            quantiteTheorique,
            ecart: quantiteEcart,
            montantTheorique: quantiteTheorique * prixUnitaire[type as keyof typeof prixUnitaire],
            montantReel,
            prixUnitaire: prixUnitaire[type as keyof typeof prixUnitaire],
            unite: entreeItem.unite || null,
            dateEntree: entreeItem.date || null,
            dateSortie: null,
          });
        }
      });    
    });

    // Boucle sur les quantités sorties
    quantitesSortiesFiltered.forEach((sortieItem: any) => {
      const typeCarburants = ["Gazoil", "Diesel", "Super"];
      typeCarburants.forEach((type) => {
        const quantiteSortieRaw = sortieItem[`quantite_${type.toLowerCase()}_sortie`] || 0;
        const quantiteSortie = convertToLitres(quantiteSortieRaw, sortieItem.uniteDeMesure);

        newTotalsQuantite[type as keyof typeof newTotalsQuantite].sortie += quantiteSortie;

        const quantiteTheorique = newTotalsQuantite[type as keyof typeof newTotalsQuantite].initial +
                                  newTotalsQuantite[type as keyof typeof newTotalsQuantite].entree -
                                  newTotalsQuantite[type as keyof typeof newTotalsQuantite].sortie;

        const existingRow = transformedData.find((row) => row.type === type);
        if (existingRow) {
          existingRow.quantiteSortie += quantiteSortie;
          existingRow.quantiteTheorique = quantiteTheorique;
          const quantiteEcart = quantiteTheorique - existingRow.quantiteReelle;
          existingRow.ecart = quantiteEcart;
          existingRow.montantReel = existingRow.quantiteReelle * prixUnitaire[type as keyof typeof prixUnitaire];
        }
      });
    });

    // Calculer les totaux
    Object.keys(newTotalsQuantite).forEach((type) => {
      const key = type as keyof typeof newTotalsQuantite;
      const totaux = newTotalsQuantite[key];

      if (totaux.initial >= 0 && totaux.entree >= 0 && totaux.sortie >= 0) {
        totaux.theorique = totaux.initial + totaux.entree - totaux.sortie;
        totaux.ecart = totaux.reelle - totaux.theorique;
        totaux.montantTheorique = totaux.theorique * totaux.prixUnitaire;
        totaux.montantReel = totaux.reelle * totaux.prixUnitaire;
        console.log(`Quantités pour ${key} :`, totaux);
      } else {
        console.warn(`Données invalides pour le carburant ${key}`);
      }
    });
    // Mettre à jour les états
    setTotalsQuantite(newTotalsQuantite);
  };

  // Fonction pour réinitialiser les filtres
  const handleResetFilter = () => {
    initTable();
    setInterval({ start: '', end: '' });
  };
  useEffect(() => {
    initTable();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
     width: '100%',  marginTop: '0px' }}>
      <Typography variant="h4" textAlign="center" gutterBottom color="success" >
        TABLEAU DES ETATS DE STOCKS MENSUELLES DU MOIS {month}
      </Typography>
      <Box display="flex" justifyContent='left' alignItems="center" width='100%'>
        <IconButton sx={{ mt: 2, ml: 2, background: 'green' }} onClick={() => { navigate(-1); }}>
          <ArrowBack sx={{ color: 'white' }} />
        </IconButton>
      </Box>
      <Box sx={{
        display: 'flex',
        gap: 2,
        marginTop: 2,
        justifyContent: 'center',
        width: '100%',
        marginBottom: '20px'
      }}>
        <TextField
          label="Date de début"
          type="date"
          value={interval.start}
          onChange={(e) => handleDateRangeChange(e.target.value, interval.end)}
          style={{ width: '300px', height: '50px' }}
        />
        <TextField
          label="Date de fin"
          type="date"
          value={interval.end}
          onChange={(e) => handleDateRangeChange(interval.start, e.target.value)}
          style={{ width: '300px', height: '50px' }}
        />
        <Button onClick={handleResetFilter} color='success'
         sx={{border:'solid 1px', borderColor:'green',width:'300px'}}>Afficher tout</Button>
      </Box>
      <TableContainer component={Paper} >
        <Table>
          <TableHead sx={{ backgroundColor: 'green' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Carburant</TableCell>
              <TableCell align="right" width="10%" sx={{ color: 'white' }}>
                Stock Initial
              </TableCell>
              <TableCell align="right" width="10%" sx={{ color: 'white' }}>
                Quantité Entrée
              </TableCell>
              <TableCell align="right" width="10%" sx={{ color: 'white' }}>
                Quantité Sortie
              </TableCell>
              <TableCell align="right" width="15%" sx={{ color: 'white' }}>
                Quantité Réelle (Corrigée)
              </TableCell>
              <TableCell align="right" width="15%" sx={{ color: 'white' }}>
                Quantité Théorique
              </TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>
                Ecart
              </TableCell>
              <TableCell align="right" width="10%" sx={{ color: 'white' }}>
                Prix Unitaire
              </TableCell>
              <TableCell align="right" width="15%" sx={{ color: 'white' }}>
                Montant Théorique
              </TableCell>
              <TableCell align="right" width="15%" sx={{ color: 'white' }}>
                Montant Réel
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Ligne des totaux */}
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Gazoil(L)</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.initial.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.entree.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.sortie.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.reelle.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.theorique.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.ecart.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.prixUnitaire}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.montantTheorique.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Gazoil.montantReel.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#00FF0080' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Diesel(L)</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.initial.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.entree.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.sortie.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.reelle.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.theorique.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.ecart.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.prixUnitaire}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.montantTheorique.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Diesel.montantReel.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Super(L)</TableCell>
              <TableCell align="right">{totalsQuantite.Super.initial.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.entree.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.sortie.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.reelle.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.theorique.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.ecart.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.prixUnitaire}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.montantTheorique.toFixed(2)}</TableCell>
              <TableCell align="right">{totalsQuantite.Super.montantReel.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DetailsStock;
