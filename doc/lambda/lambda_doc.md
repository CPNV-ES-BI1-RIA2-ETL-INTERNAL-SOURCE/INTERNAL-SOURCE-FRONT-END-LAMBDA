# AWS Lambda - Guide de fonctionnement

## Qu'est-ce qu'une Lambda ?

Une Lambda est une unité de calcul serverless proposée par AWS qui permet d'exécuter du code sans avoir à gérer des serveurs. Le code s'exécute en réponse à des événements et AWS s'occupe automatiquement de l'allocation des ressources nécessaires.

## Structure d'une Lambda

### 1. Handler Function

```javascript
export const handler = async (event, context) => {
    // Votre code ici
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" })
    };
};
```

- `event` : Contient les données d'entrée
- `context` : Fournit des informations sur l'environnement d'exécution

### 2. Cycle de vie

1. **Cold Start** (Démarrage à froid)
   - Création d'un nouvel environnement d'exécution
   - Chargement du code
   - Initialisation des dépendances
   - Plus lent que le warm start

2. **Warm Start** (Démarrage à chaud)
   - Réutilisation d'un environnement existant
   - Plus rapide car pas de nouvelle initialisation
   - Le conteneur peut être réutilisé pendant plusieurs heures

### 3. Timeouts et Limites

- Timeout maximum : 15 minutes
- Mémoire : 128 MB à 10 GB
- Taille du package déployé : jusqu'à 50 MB (compressé) ou 250 MB (non compressé)
- Payload maximum : 6 MB (synchrone) ou 256 KB (asynchrone)

## Déclencheurs (Triggers)

Les Lambdas peuvent être déclenchées par différents événements :

1. **HTTP (API Gateway)**
   ```json
   {
     "resource": "/path",
     "httpMethod": "GET",
     "headers": {},
     "queryStringParameters": {},
     "body": ""
   }
   ```

2. **S3**
   ```json
   {
     "Records": [{
       "eventName": "ObjectCreated:Put",
       "s3": {
         "bucket": { "name": "" },
         "object": { "key": "" }
       }
     }]
   }
   ```

3. **CloudWatch Events**
4. **SQS**
5. **SNS**
6. Et bien d'autres...

## Variables d'environnement

```javascript
// Accès aux variables d'environnement
const dbName = process.env.DATABASE_NAME;
const apiKey = process.env.API_KEY;
```

- Stockées de manière sécurisée
- Peuvent être chiffrées avec KMS
- Modifiables sans redéploiement du code

## Bonnes pratiques

### 1. Gestion des ressources

```javascript
// Réutiliser les connexions
const client = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
    // client est réutilisé entre les invocations
};
```

### 2. Gestion des erreurs

```javascript
try {
    // Votre code
} catch (error) {
    console.error('Error:', error);
    return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
            error: error.message
        })
    };
}
```

### 3. Logging

```javascript
console.log('INFO:', 'Début du traitement');
console.error('ERROR:', 'Une erreur est survenue');
```

- Les logs sont automatiquement envoyés à CloudWatch
- Utilisez différents niveaux de log (INFO, ERROR, DEBUG)

## Monitoring

1. **CloudWatch Metrics**
   - Invocations
   - Durée
   - Erreurs
   - Throttling

2. **CloudWatch Logs**
   - Logs d'exécution
   - Traces d'erreur
   - Logs personnalisés

## Déploiement

### 1. Via la Console AWS
- Upload direct du code
- Configuration via l'interface web
- Tests intégrés

### 2. Via AWS CLI
```bash
# Créer une fonction
aws lambda create-function \
  --function-name maFonction \
  --runtime nodejs18.x \
  --handler index.handler \
  --zip-file fileb://function.zip

# Mettre à jour le code
aws lambda update-function-code \
  --function-name maFonction \
  --zip-file fileb://function.zip
```

## Sécurité

1. **IAM Roles**
   - Principe du moindre privilège
   - Permissions spécifiques aux services utilisés

2. **VPC**
   - Accès aux ressources privées
   - Isolation réseau

3. **Encryption**
   - Variables d'environnement
   - Données en transit
   - Données au repos

## Coûts

- Facturation à la milliseconde
- Basée sur :
  - Nombre d'invocations
  - Durée d'exécution
  - Mémoire allouée
- Niveau gratuit disponible :
  - 1M de requêtes gratuites par mois
  - 400 000 GB-secondes de temps de calcul

**Example de log de facturation:**

```bash
END RequestId: a80c1991-40f4-481a-83d1-************
REPORT RequestId: a80c1991-40f4-481a-83d1-************	Duration: 3048.93 ms	Billed Duration: 3000 ms	Memory Size: 128 MB	Max Memory Used: 45 MB
```