import { StoreLogic } from "../core/store-logic.js";
import { WebhookService } from "../webhooks/webhook-service.js";

type LoginPayload = {
  email?: unknown;
  mobile?: unknown;
};

const asString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

export class SimulatorAuthOrchestrator {
  constructor(
    private readonly storeLogic: StoreLogic,
    private readonly webhookService: WebhookService,
  ) {}

  public async dispatchMockLogin(
    storeId: string | undefined,
    payload: LoginPayload,
  ) {
    const normalizedStoreId = asString(storeId).trim();
    if (!normalizedStoreId) return;

    const webhooks = await this.storeLogic.getWebhooks(normalizedStoreId);
    const customer = {
      id: "cust_123",
      first_name: "Mock",
      last_name: "Customer",
      email: asString(payload?.email) || "user@example.com",
      mobile: asString(payload?.mobile) || "+966500000000",
    };

    this.webhookService.dispatchEvent("customer.login", { customer }, webhooks);
  }
}
