export class KeyManager {
  public static oauthStateKey(state: string) {
    return `oauth:${state}`;
  }

  public static partitionKey(partitionId: number) {
    return `partition:${partitionId}`;
  }
}
