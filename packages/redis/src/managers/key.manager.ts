export class KeyManager {
  public static oauthStateKey(state: string) {
    return `oauth:${state}`;
  }
}
