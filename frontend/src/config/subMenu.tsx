// src/constants/subMenus.js
import {
    Home,
    Storage,
    LocalShipping,
    LocalGasStation,
    Summarize,
    OilBarrel,
    EvStation,
    Warehouse,
    LocalConvenienceStore,
    CarRepair,
    BakeryDiningRounded,
    Category,
    Payment,
    ReceiptLong,
    Storefront,
    Group,
    Settings,
    Assignment,
    Inbox,
    Save,
    MenuBook,
} from '@mui/icons-material';

type SubMenuKeys = "Tableau de bord" | "Stock" | "Clients" | "Transaction" | "Réseau d'approvisionnement" | "Accueil";

const subMenus: Record<SubMenuKeys, { label: string; path: string; icon: JSX.Element }[]> = {
    "Tableau de bord": [
        { label: "SenStock", path: "/accueil/tableau-de-bord/senstock", icon: <OilBarrel /> },
        { label: "DOT", path: "/accueil/tableau-de-bord/dot", icon: <EvStation /> },
        { label: "ORYX", path: "/accueil/tableau-de-bord/oryx", icon: <LocalGasStation /> },
        { label: "RECAPILATIF", path: "/accueil/tableau-de-bord/recapilatif", icon: <Summarize /> },
    ],
    "Stock": [
        { label: "Stockeur", path: "/accueil/stock/stockeur", icon: <Storage /> },
        { label: "Dépôt", path: "/accueil/stock/depot", icon: <Warehouse /> },
    ],
    "Clients": [
        { label: "Station Service", path: "/accueil/clients/station-service", icon: <LocalConvenienceStore /> },
        { label: "Garage Automobile", path: "/accueil/clients/garage-automobile", icon: <CarRepair /> },
        { label: "Boulangerie", path: "/accueil/clients/boulangerie", icon: <BakeryDiningRounded /> },
        { label: "Autre", path: "/accueil/clients/autre", icon: <Category /> },
    ],
    "Transaction": [
        { label: "Bon de livraison", path: "/accueil/transaction/bon-livraison", icon: <LocalShipping /> },
        { label: "Mode de Paiement", path: "/accueil/transaction/mode-paiement", icon: <Payment /> },
        { label: "Enregistrement facture", path: "/accueil/transaction/facture", icon: <Save /> },
        { label: "Reception de facture", path: "/accueil/transaction/reception-facture", icon: <Inbox /> },
    ],
    "Réseau d'approvisionnement": [
        { label: "Fournisseurs", path: "/accueil/reseau-approvisionnement/fournisseurs", icon: <Storefront /> },
        { label: "Utilisateurs", path: "/accueil/reseau-approvisionnement/utilisateurs", icon: <Group /> },
        { label: "Configuration", path: "/accueil/reseau-approvisionnement/configuration", icon: <Settings /> },
        { label: "ipm", path: "/accueil/reseau-approvisionnement/ipm", icon: <MenuBook /> },
    ],
    "Accueil": [
        { label: "Home", path: "/accueil", icon: <Home /> },
    ],
};

export default subMenus;
