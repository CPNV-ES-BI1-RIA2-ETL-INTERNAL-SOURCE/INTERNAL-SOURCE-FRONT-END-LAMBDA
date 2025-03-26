import { handler } from '../src/index.mjs';
import { QuickSightClient } from '@aws-sdk/client-quicksight';

// Mock the QuickSight client
jest.mock('@aws-sdk/client-quicksight', () => {
  return {
    QuickSightClient: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({
        EmbedUrl: 'https://quicksight.aws.amazon.com/embed/12345',
        RequestId: 'test-request-id-123'
      })
    })),
    GetDashboardEmbedUrlCommand: jest.fn()
  };
});

describe('Lambda Handler Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Set up environment variables with mock values
    process.env.AWS_ACCOUNT_ID = '123456789012';
    process.env.DASHBOARD_ID = 'mock-dashboard-id';
    process.env.QUICKSIGHT_USER = 'mock-user';
  });

  test('should successfully return dashboard embed URL', async () => {
    const event = {
      namespace: 'default',
      sessionLifetime: 600
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    });

    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('embedUrl');
    expect(body).toHaveProperty('requestId');
    expect(body.embedUrl).toContain('quicksight.aws.amazon.com/embed/');
  });

  test('should use default values when optional parameters are not provided', async () => {
    const event = {};

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('embedUrl');
    expect(body).toHaveProperty('requestId');
  });

  test('should handle QuickSight API errors', async () => {
    // Mock QuickSight client to throw an error
    QuickSightClient.mockImplementationOnce(() => ({
      send: jest.fn().mockRejectedValue({
        name: 'AccessDeniedException',
        message: 'Access Denied',
        $metadata: {
          httpStatusCode: 403,
          requestId: 'error-request-id'
        }
      })
    }));

    const event = {
      namespace: 'default'
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(403);
    const body = JSON.parse(response.body);
    expect(body.errorType).toBe('AccessDeniedException');
    expect(body.message).toBe('Access Denied');
    expect(body.requestId).toBe('error-request-id');
  });

  test('should handle missing environment variables', async () => {
    // Clear required environment variables
    delete process.env.AWS_ACCOUNT_ID;
    delete process.env.DASHBOARD_ID;

    const event = {
      namespace: 'default'
    };

    const response = await handler(event);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body);
    expect(body.errorType).toBeTruthy();
    expect(body.message).toBeTruthy();
  });
}); 