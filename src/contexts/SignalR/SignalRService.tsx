import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';

class SignalRService {
  private connection: HubConnection | null = null;

  public async startConnection(url: string): Promise<void> {
    if (this.connection) return;

    this.connection = new HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.onreconnecting(() => {
      console.log('SignalR connection lost. Attempting to reconnect...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR connection reestablished.');
    });

    this.connection.onclose(() => {
      console.log('SignalR connection closed.');
    });

    try {
      await this.connection.start();
      console.log('SignalR connection established.');
    } catch (error) {
      console.error('Error establishing SignalR connection:', error);
    }
  }

  public getConnection(): HubConnection | null {
    return this.connection;
  }

  public stopConnection(): void {
    this.connection?.stop();
    this.connection = null;
  }
}

const signalRService = new SignalRService();
export default signalRService;
