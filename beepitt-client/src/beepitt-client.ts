import axios from 'axios';

export enum Environment {
    Production = 'production',
    Staging = 'staging',
    Development = 'development',
    QA = 'qa',
    UAT = 'uat',
    Sandbox = 'sandbox',
}

export enum EventType {
    Issue = 'issue',
    Incident = 'incident',
}

export interface BeepittPayload {
    name: string;
    description: string;
    stack?: Error;
    filePath?: string | null;
    lineNumber?: number | null;
    columnNumber?: number | null;
    environment: Environment | string;
    group?: string | null;
}

export class BeepittClient {
    private authToken: string;
    private baseUrl: string;

    constructor(
        authToken: string,
        baseUrl: string = 'https://francisco-unscholarlike-punctually.ngrok-free.dev'
    ) {
        this.authToken = authToken;
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    }

    private getIssueLineAndColumn(error: Error) {
        const stackLines = error.stack?.split('\n') || [];
        const appStack = stackLines.filter(line =>
            !line.includes('node_modules') &&
            !line.includes('node:')
        );

        const sourceLine = appStack.find(line => line.includes('at '));

        if (!sourceLine) {
            return { filePath: null, lineNumber: null, columnNumber: null, };
        }

        const bracketOpenFirstIndex = sourceLine.indexOf('(')
        const bracketCloseLastIndex = sourceLine.lastIndexOf(')')

        const sourceLineCleaned = sourceLine.slice(bracketOpenFirstIndex + 1, bracketCloseLastIndex);

        const colonLastIndex = sourceLineCleaned.lastIndexOf(':');
        const colonSecondLastIndex = sourceLineCleaned.lastIndexOf(':', colonLastIndex - 1);

        const filePath = sourceLineCleaned.slice(0, colonSecondLastIndex);
        const lineNumber = sourceLineCleaned.slice(colonSecondLastIndex + 1, colonLastIndex);
        const columnNumber = sourceLineCleaned.slice(colonLastIndex + 1);

        const isPath = (str: string) => /[\\/]/.test(str);
        const isNumber = (str: string) => !isNaN(Number(str));

        const finalFilePath = isPath(filePath) ? filePath : null;
        const finalLineNumber = isNumber(lineNumber) ? Number(lineNumber) : null;
        const finalColumnNumber = isNumber(columnNumber) ? Number(columnNumber) : null;

        return {
            filePath: finalFilePath,
            lineNumber: finalLineNumber,
            columnNumber: finalColumnNumber,
        };
    }

    private async dispatch(type: EventType, payload: BeepittPayload) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/app/webhook/onClientIncident`,
                {
                    ...payload,
                    type,
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
            throw new Error(`Beepitt dispatch failed: ${errorMessage}`);
        }
    }

    public async dispatchIncident(name: string, description: string, environment: Environment, group?: string, filePath?: string, lineNumber?: number, columnNumber?: number) {
        let payload: BeepittPayload = {
            name,
            description,
            group: group || null,
            environment,
            filePath: filePath || null,
            lineNumber: lineNumber || null,
            columnNumber: columnNumber || null
        };
        return this.dispatch(EventType.Incident, payload);
    }

    public async dispatchIssue(name: string, description: string, err: any, environment: Environment, group?: string) {
        const error = err instanceof Error ? err : new Error(String(err));

        let { filePath, lineNumber, columnNumber } = this.getIssueLineAndColumn(error);

        let payload: BeepittPayload = {
            name,
            description,
            stack: error,
            group: group || null,
            environment,
            filePath,
            lineNumber,
            columnNumber,
        };

        return this.dispatch(EventType.Issue, payload);
    }
}
