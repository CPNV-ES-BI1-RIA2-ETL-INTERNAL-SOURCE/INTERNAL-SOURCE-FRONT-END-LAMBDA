import { QuickSightClient, GetDashboardEmbedUrlCommand } from "@aws-sdk/client-quicksight";

export const handler = async (event) => {
    try {
        // Initialize QuickSight client
        const quicksightClient = new QuickSightClient({ region: 'eu-central-1' });
        
        // Get parameters from environment variables or event
        const awsAccountId = process.env.AWS_ACCOUNT_ID;
        const dashboardId = process.env.DASHBOARD_ID;
        const quicksightUser = process.env.QUICKSIGHT_USER;
        const namespace = event.namespace || 'default';
        const sessionLifetime = event.sessionLifetime || 600; // 10 hours max
        
        // Construct the QuickSight user ARN
        const userArn = `arn:aws:quicksight:eu-south-1:${awsAccountId}:user/${namespace}/${quicksightUser}`;
        
        // Prepare the command parameters
        const params = {
            AwsAccountId: awsAccountId,
            DashboardId: dashboardId,
            IdentityType: 'QUICKSIGHT',
            SessionLifetimeInMinutes: sessionLifetime,
            Namespace: namespace,
            UserArn: userArn // Always include UserArn for QUICKSIGHT identity type
        };

        // Create the command
        const command = new GetDashboardEmbedUrlCommand(params);

        // Execute the command
        const response = await quicksightClient.send(command);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Configure this according to your needs
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                embedUrl: response.EmbedUrl,
                requestId: response.RequestId
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: error.$metadata?.httpStatusCode || 500,
            body: JSON.stringify({
                message: error.message,
                errorType: error.name,
                requestId: error.$metadata?.requestId
            })
        };
    }
};
