import { producer } from "@repo/kafka/producer";
import { PartitionSessionStore } from "../entities/store.js";
import { Topic } from "@repo/kafka/meta";
import { Session } from "@repo/validation";

export class SessionManager {
  private static instance: SessionManager;
  private store: PartitionSessionStore;
  private timers: Map<string, NodeJS.Timeout>;
  private MAX_TIMEOUT = 300000;

  private constructor() {
    this.store = new PartitionSessionStore();
    this.timers = new Map();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SessionManager();
    }
    return this.instance;
  }

  private clearTimer(userId: string) {
    const timer = this.timers.get(userId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(userId);
    }
  }

  private startTimer(partitionId: number, userId: string, sessionId: string) {
    const timer = setTimeout(() => {
      this.endSession(partitionId, userId, sessionId);
    }, this.MAX_TIMEOUT);
    this.timers.set(userId, timer);
  }

  private async endSession(
    partitionId: number,
    userId: string,
    sessionId: string,
  ) {
    this.clearTimer(userId);

    const session: Session = {
      userId,
      sessionId,
    };

    await producer.send({
      topic: Topic.SESSION_ENDED,
      messages: [{ value: JSON.stringify(session) }],
    });

    await this.store.delete(partitionId, userId);
  }

  public async rebalance(partitions: number[]) {
    const prevPartitions = this.store.allPartitions();
    const commonPartitions = new Set(
      partitions.filter((p) => prevPartitions.has(p)),
    );
    const partitionsToRemove = [...prevPartitions].filter(
      (p) => !commonPartitions.has(p),
    );
    const partitionsToLoad = partitions.filter((p) => !commonPartitions.has(p));

    partitionsToRemove.forEach((p) => {
      this.store.getPartition(p).forEach((userId) => this.clearTimer(userId));
      this.store.clearPartition(p);
    });

    await Promise.all(
      partitionsToLoad.map(async (p) => {
        const entries = await this.store.loadPartition(p);
        for (const [userId, sessionId] of Object.entries(entries)) {
          this.startTimer(p, userId, sessionId);
        }
      }),
    );
  }

  public async add(partitionId: number, userId: string): Promise<string> {
    const sessionId = this.store.get(partitionId, userId);
    if (!sessionId) {
      const sessionId = crypto.randomUUID();
      await this.store.set(partitionId, userId, sessionId);
      this.startTimer(partitionId, userId, sessionId);

      return sessionId;
    } else {
      this.clearTimer(userId);
      this.startTimer(partitionId, userId, sessionId);

      return sessionId;
    }
  }
}
