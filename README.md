# QuickSight Dashboard Embed URL Lambda

Cette Lambda function permet de générer des URLs d'intégration (embed URLs) pour les dashboards QuickSight. Elle utilise l'API AWS QuickSight pour générer des URLs temporaires qui peuvent être utilisées pour intégrer des dashboards dans des applications web.

## Table des matières

- [Prérequis](#prérequis)
- [Configuration AWS](#configuration-aws)
  - [Variables d'environnement](#variables-denvironnement)
  - [Configuration IAM](#configuration-iam)
  - [Configuration QuickSight](#configuration-quicksight)
- [Déploiement](#déploiement)
- [Utilisation](#utilisation)
- [Structure du code](#structure-du-code)
- [Dépannage](#dépannage)

## Prérequis

- Un compte AWS avec accès à Lambda et QuickSight
- Node.js 18.x ou supérieur
- Un dashboard QuickSight existant
- npm ou yarn pour la gestion des dépendances
- AWS CLI (version 2)

## Configuration AWS

### Variables d'environnement

La Lambda nécessite les variables d'environnement suivantes :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `AWS_ACCOUNT_ID` | L'ID de votre compte AWS (12 chiffres) | `123456789012` |
| `DASHBOARD_ID` | L'ID de votre dashboard QuickSight | `1a2b3c4d-5e6f-7g8h-9i0j` |
| `QUICKSIGHT_USER` | Le nom d'utilisateur QuickSight | `john.doe` |

Pour configurer ces variables :
1. Ouvrez la console AWS Lambda
2. Sélectionnez votre fonction
3. Allez dans l'onglet "Configuration"
4. Cliquez sur "Variables d'environnement"
5. Ajoutez les variables mentionnées ci-dessus

### Configuration IAM

La Lambda nécessite un rôle IAM avec les permissions suivantes :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "quicksight:GetDashboardEmbedUrl"
            ],
            "Resource": [
                "arn:aws:quicksight:eu-central-1:*:dashboard/*",
                "arn:aws:quicksight:eu-central-1:*:user/*"
            ]
        }
    ]
}
```

Pour configurer le rôle IAM :
1. Ouvrez la console AWS IAM
2. Créez un nouveau rôle ou modifiez le rôle existant de votre Lambda
3. Attachez la politique ci-dessus
4. Assurez-vous que le rôle a aussi la politique `AWSLambdaBasicExecutionRole`

### Configuration QuickSight

1. Assurez-vous que votre dashboard est partagé avec l'utilisateur QuickSight spécifié
2. Configurez les paramètres de sécurité du dashboard :
   - Allez dans QuickSight
   - Sélectionnez votre dashboard
   - Cliquez sur "Share"
   - Vérifiez les permissions de l'utilisateur

## Déploiement

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez le package de déploiement :
```bash
zip -r function.zip .
```

4. Déployez sur AWS Lambda :
```bash
aws lambda update-function-code --function-name [NOM_DE_VOTRE_FONCTION] --zip-file fileb://function.zip
```

## Utilisation

La Lambda accepte les paramètres d'entrée suivants (event) :

```json
{
    "namespace": "default",  // optionnel, par défaut "default"
    "sessionLifetime": 600   // optionnel, par défaut 600 minutes (10 heures)
}
```

Exemple de réponse réussie :
```json
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": {
        "embedUrl": "https://quicksight.aws.amazon.com/embed/...",
        "requestId": "7b55dbe5-5073-4a33-8655-b57e8c1c87e2"
    }
}
```

## Structure du code

Le code est organisé comme suit :
- `src/index.mjs` : Point d'entrée de la Lambda
- `package.json` : Gestion des dépendances et configuration du projet

Principales dépendances :
- `@aws-sdk/client-quicksight` : SDK AWS pour interagir avec QuickSight

## Dépannage

### Erreurs communes

1. **AccessDeniedException**
   - Vérifiez les permissions IAM
   - Vérifiez que l'utilisateur QuickSight existe et a accès au dashboard

2. **ValidationException**
   - Vérifiez que toutes les variables d'environnement sont correctement configurées
   - Vérifiez que l'ID du dashboard est correct

3. **ResourceNotFoundException**
   - Vérifiez que le dashboard existe dans la région spécifiée
   - Vérifiez que l'utilisateur QuickSight existe

4. **Erreur de région**
   - Assurez-vous que la région dans l'ARN correspond à la région de votre dashboard
   - La région est actuellement configurée sur 'eu-central-1'

Pour tout autre problème, consultez les logs CloudWatch de votre Lambda pour plus de détails sur les erreurs.
