import axios from 'axios';

/**
 * Valid environments for Beepitt events.
 */
export enum Environment {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
  QA = 'qa',
  UAT = 'uat',
  Sandbox = 'sandbox',
}

/**
 * Types of events supported by Beepitt.
 */
export enum EventType {
  Issue = 'issue',
  Incident = 'incident',
}

/**
 * Payload interface for dispatching events to Beepitt.
 */
export interface BeepittPayload {
  name: string;
  description: string;
  filePath?: string | null;
  lineNumber?: number | null;
  columnNumber?: number | null;
  environment: Environment | string;
  group?: string | null;
}

/**
 * BeepittClient - A simple client to dispatch issues and incidents to the Beepitt service.
 */
export class BeepittClient {
  private authToken: string;
  private projectName: string;
  private baseUrl: string;

  constructor(
    authToken: string,
    projectName: string,
    baseUrl: string = 'https://francisco-unscholarlike-punctually.ngrok-free.dev'
  ) {
    this.authToken = authToken;
    this.projectName = projectName;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Internal method to dispatch an event.
   */
  private async dispatch(type: EventType, payload: BeepittPayload) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/app/webhook/onClientIncident`,
        {
          ...payload,
          type,
          projectName: this.projectName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.authToken,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error(`[Beepitt] [${type}] Dispatch failed: ${errorMessage}`);
      throw new Error(`Beepitt dispatch failed: ${errorMessage}`);
    }
  }

  /**
   * Dispatches an incident to Beepitt.
   * @param payload - The incident details.
   */
  public async dispatchIncident(payload: BeepittPayload) {
    return this.dispatch(EventType.Incident, payload);
  }

  /**
   * Dispatches an issue to Beepitt.
   * @param payload - The issue details.
   */
  public async dispatchIssue(payload: BeepittPayload) {
    return this.dispatch(EventType.Issue, payload);
  }
}

// Example usage:
// const client = new BeepittClient('YOUR_AUTH_TOKEN', 'MyProject');
// client.dispatchIncident({
//   name: 'Database Connection Error',
//   description: 'Unable to connect to the primary database after retry.',
//   environment: Environment.Production,
//   filePath: 'src/db.ts',
//   lineNumber: 42
// });
