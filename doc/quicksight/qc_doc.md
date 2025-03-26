# AWS QuickSight - Guide de fonctionnement

## Qu'est-ce que QuickSight ?

Amazon QuickSight est un service de Business Intelligence (BI) cloud qui permet de créer et de publier des tableaux de bord interactifs accessibles depuis n'importe quel appareil et intégrables dans vos applications, portails ou sites web.

## Concepts clés

### 1. Architecture

```plaintext
Sources de données → Jeux de données → Analyses → Tableaux de bord
```

1. **Sources de données**
   - Amazon S3
   - Amazon RDS
   - Amazon Redshift
   - Fichiers locaux (CSV, Excel)
   - Et bien d'autres...

2. **Jeux de données (Datasets)**
   - Préparation des données (ETL léger)
   - Jointures
   - Calculs personnalisés
   - Mise en cache SPICE

3. **Analyses**
   - Visualisations interactives
   - Filtres
   - Paramètres
   - Actions

4. **Tableaux de bord**
   - Version publiée des analyses
   - Partageables
   - Embarquables

## Intégration (Embedding)

### 1. Types d'intégration

```javascript
// 1. Utilisateur enregistré
const params = {
    AwsAccountId: 'XXXXXXXXXXXX',
    DashboardId: 'dashboard-id',
    IdentityType: 'QUICKSIGHT',
    UserArn: 'arn:aws:quicksight:region:account:user/username'
};

// 2. Anonyme
const params = {
    AwsAccountId: 'XXXXXXXXXXXX',
    DashboardId: 'dashboard-id',
    IdentityType: 'ANONYMOUS'
};
```

### 2. Méthodes d'authentification

1. **IAM**
   - Utilisateurs IAM
   - Rôles IAM
   - Fédération d'identité

2. **QuickSight**
   - Utilisateurs QuickSight
   - Groupes QuickSight
   - Enterprise Edition requise

3. **Anonyme**
   - Pas d'authentification requise
   - Capacité de session requise
   - Facturation à l'utilisation

## Sécurité et Permissions

### 1. Niveau Ressource

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "quicksight:GetDashboardEmbedUrl",
                "quicksight:GenerateEmbedUrlForRegisteredUser"
            ],
            "Resource": "*"
        }
    ]
}
```

### 2. Niveau Données

- Row-Level Security (RLS)
- Column-Level Security (CLS)
- Filtres persistants

### 3. Niveau Application

```javascript
// Configuration CORS
headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
}
```

## Personnalisation

### 1. Thèmes et Styles

```json
{
    "UIConfig": {
        "HideParameters": true,
        "HideExportVisual": true,
        "HideFilter": true
    }
}
```

### 2. Actions personnalisées

```javascript
// Écoute des événements
embedDashboard.on('parameterChanged', (event) => {
    console.log('Parameter changed:', event.detail);
});
```

## Bonnes pratiques

### 1. Performance

- Utiliser SPICE pour le cache
- Optimiser les requêtes
- Limiter le nombre de visuels par dashboard
- Utiliser des filtres efficaces

### 2. Sécurité

- Appliquer le principe du moindre privilège
- Utiliser des rôles IAM dédiés
- Chiffrer les données sensibles
- Activer le logging CloudTrail

### 3. Coûts

- Monitorer l'utilisation SPICE
- Gérer les sessions utilisateurs
- Optimiser les actualisations de données

## Monitoring

### 1. CloudWatch Metrics

- Nombre de sessions
- Utilisation SPICE
- Temps de réponse
- Erreurs

### 2. CloudTrail

- Audit des actions
- Sécurité
- Conformité

## Limites et Quotas

1. **Visualisations**
   - 20 visuels par feuille
   - 20 feuilles par analyse
   - 50 analyses par compte

2. **Données**
   - SPICE : 10 GB par compte (extensible)
   - Taille maximale de fichier : 1 GB
   - Refresh : minimum 1 heure

3. **Embedding**
   - URL valide 5 minutes
   - Session utilisateur : 10 heures max
   - Capacité : selon le plan

## Coûts

### 1. Éditions
- Standard
  - Utilisateurs nommés
  - Fonctionnalités de base
- Enterprise
  - Embedding
  - Row-level security
  - Encryption at rest

### 2. Facturation
- Par utilisateur/mois
- Capacité SPICE
- Sessions d'embedding
- Lecteurs (pay-per-session)

### 3. Optimisation
- Nettoyer les ressources inutilisées
- Gérer les actualisations de données
- Surveiller l'utilisation SPICE
- Optimiser les sessions d'embedding 