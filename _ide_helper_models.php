<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\BonDeCommande
 *
 * @property int $id
 * @property string $emetteur
 * @property string $date
 * @property int $quantite
 * @property string $UniteDeMesure
 * @property string $format
 * @property string $produit
 * @property string $heure
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Facture> $factures
 * @property-read int|null $factures_count
 * @property-read \App\Models\UserSgf|null $sgf
 * @method static \Database\Factories\BonDeCommandeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande query()
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereEmetteur($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereFormat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereHeure($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereProduit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereQuantite($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereUniteDeMesure($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeCommande whereUpdatedAt($value)
 */
	class BonDeCommande extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\BonDeLivraison
 *
 * @property int $id
 * @property int $idCamionCiterne
 * @property string $dateLivraison
 * @property int $quantite
 * @property string $UniteDeMesure
 * @property string $destinataire
 * @property string $produit
 * @property string $heure
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CamionCiterne $camionCiterne
 * @method static \Database\Factories\BonDeLivraisonFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison query()
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereDateLivraison($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereDestinataire($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereHeure($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereIdCamionCiterne($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereProduit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereQuantite($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereUniteDeMesure($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BonDeLivraison whereUpdatedAt($value)
 */
	class BonDeLivraison extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Boulangerie
 *
 * @property int $id
 * @property int $idClient
 * @property string $responsable
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client $client
 * @method static \Database\Factories\BoulangerieFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie query()
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie whereIdClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie whereResponsable($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Boulangerie whereUpdatedAt($value)
 */
	class Boulangerie extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CamionCiterne
 *
 * @property int $id
 * @property string $immat
 * @property string $nomChauffeur
 * @property int $nombreCompartiment
 * @property string $volumeCompartiment
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BonDeLivraison> $bonDeLivraison
 * @property-read int|null $bon_de_livraison_count
 * @method static \Database\Factories\CamionCiterneFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne query()
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne whereImmat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne whereNomChauffeur($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne whereNombreCompartiment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CamionCiterne whereVolumeCompartiment($value)
 */
	class CamionCiterne extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Client
 *
 * @property int $idClient
 * @property string $nom
 * @property string $adresse
 * @property string $telephone
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Boulangerie> $boulangeries
 * @property-read int|null $boulangeries_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GarageAutomobile> $garagesAutomobiles
 * @property-read int|null $garages_automobiles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StationService> $stationsServices
 * @property-read int|null $stations_services_count
 * @method static \Database\Factories\ClientFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Client newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Client newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Client query()
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereAdresse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereIdClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereUpdatedAt($value)
 */
	class Client extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Depot
 *
 * @property int $idDepot
 * @property string $nom
 * @property string $adresse
 * @property int $idStokeur
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Stokeur $stokeur
 * @method static \Database\Factories\DepotFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Depot newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Depot newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Depot query()
 * @method static \Illuminate\Database\Eloquent\Builder|Depot whereAdresse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Depot whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Depot whereIdDepot($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Depot whereIdStokeur($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Depot whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Depot whereUpdatedAt($value)
 */
	class Depot extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Facture
 *
 * @property int $id
 * @property string $reference
 * @property string $prixUnitaire
 * @property int $quantite
 * @property string $montant
 * @property string $UniteDeMesure
 * @property string $date
 * @property string $etat
 * @property int $idModePaiement
 * @property int|null $idBonLivraison
 * @property int|null $idBonCommande
 * @property string $taxe
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\BonDeCommande|null $bonCommande
 * @property-read \App\Models\BonDeLivraison|null $bonLivraison
 * @property-read \App\Models\ModePaiement $modePaiement
 * @method static \Database\Factories\FactureFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Facture newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Facture newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Facture query()
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereEtat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereIdBonCommande($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereIdBonLivraison($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereIdModePaiement($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereMontant($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture wherePrixUnitaire($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereQuantite($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereTaxe($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereUniteDeMesure($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereUpdatedAt($value)
 */
	class Facture extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Fournisseur
 *
 * @property int $id
 * @property string $nom
 * @property string $adresse
 * @property string $telephone
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\FournisseurFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur query()
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur whereAdresse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Fournisseur whereUpdatedAt($value)
 */
	class Fournisseur extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\GarageAutomobile
 *
 * @property int $id
 * @property int $idClient
 * @property string $nom_garage
 * @property string $ChefGarage
 * @property string $adresse_garage
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client $client
 * @method static \Database\Factories\GarageAutomobileFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile query()
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile whereAdresseGarage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile whereChefGarage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile whereIdClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile whereNomGarage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GarageAutomobile whereUpdatedAt($value)
 */
	class GarageAutomobile extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ModePaiement
 *
 * @property int $id
 * @property string $typePaiement
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ModePaiementFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ModePaiement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ModePaiement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ModePaiement query()
 * @method static \Illuminate\Database\Eloquent\Builder|ModePaiement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModePaiement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModePaiement whereTypePaiement($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ModePaiement whereUpdatedAt($value)
 */
	class ModePaiement extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SGFCamionCiternes
 *
 * @property int $id
 * @property int $idUser
 * @property int $idCamionCiterne
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\SGFCamionCiternesFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes query()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes whereIdCamionCiterne($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes whereIdUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFCamionCiternes whereUpdatedAt($value)
 */
	class SGFCamionCiternes extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SGFClients
 *
 * @property int $id
 * @property int $idUser
 * @property int $idClient
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\SGFClientsFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients query()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients whereIdClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients whereIdUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFClients whereUpdatedAt($value)
 */
	class SGFClients extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SGFFournisseurs
 *
 * @property int $id
 * @property int $idUser
 * @property int $idFournisseur
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\SGFFournisseursFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs query()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs whereIdFournisseur($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs whereIdUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFFournisseurs whereUpdatedAt($value)
 */
	class SGFFournisseurs extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SGFStockeurs
 *
 * @property int $id
 * @property int $idUser
 * @property int $idStokeur
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\SGFStockeursFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs query()
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs whereIdStokeur($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs whereIdUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SGFStockeurs whereUpdatedAt($value)
 */
	class SGFStockeurs extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\StationService
 *
 * @property int $idStation
 * @property int $idClient
 * @property string $gerant
 * @property string $responsable
 * @property int $nombreDePompe
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Client $client
 * @method static \Database\Factories\StationServiceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|StationService newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StationService newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StationService query()
 * @method static \Illuminate\Database\Eloquent\Builder|StationService whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StationService whereGerant($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StationService whereIdClient($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StationService whereIdStation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StationService whereNombreDePompe($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StationService whereResponsable($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StationService whereUpdatedAt($value)
 */
	class StationService extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Stokeur
 *
 * @property int $id
 * @property string $nom
 * @property string $adresse
 * @property string $telephone
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Depot> $depots
 * @property-read int|null $depots_count
 * @method static \Database\Factories\StokeurFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur query()
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur whereAdresse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Stokeur whereUpdatedAt($value)
 */
	class Stokeur extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\UserSgf
 *
 * @property int $idUser
 * @property string $prenom
 * @property string $nom
 * @property string $adresseSGF
 * @property string $telephone
 * @property string $email
 * @property string $password
 * @property string $matricule
 * @property string $poste
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CamionCiterne> $camionCiterne
 * @property-read int|null $camion_citerne_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Client> $clients
 * @property-read int|null $clients_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Fournisseur> $fournisseurs
 * @property-read int|null $fournisseurs_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Stokeur> $stockeurs
 * @property-read int|null $stockeurs_count
 * @method static \Database\Factories\UserSgfFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereAdresseSGF($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereIdUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereMatricule($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf wherePoste($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf wherePrenom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserSgf whereUpdatedAt($value)
 */
	class UserSgf extends \Eloquent {}
}

