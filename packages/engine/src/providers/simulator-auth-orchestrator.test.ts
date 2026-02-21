import { describe, expect, it, vi } from "vitest";
import { SimulatorAuthOrchestrator } from "./simulator-auth-orchestrator.js";

describe("SimulatorAuthOrchestrator", () => {
  it("dispatches customer.login webhook with normalized payload", async () => {
    const storeLogic = {
      getWebhooks: vi.fn().mockResolvedValue([{ event: "customer.login" }]),
    } as any;
    const webhookService = {
      dispatchEvent: vi.fn(),
    } as any;

    const orchestrator = new SimulatorAuthOrchestrator(
      storeLogic,
      webhookService,
    );
    await orchestrator.dispatchMockLogin("store-1", {
      email: "test@example.com",
      mobile: "+966500000001",
    });

    expect(storeLogic.getWebhooks).toHaveBeenCalledWith("store-1");
    expect(webhookService.dispatchEvent).toHaveBeenCalledTimes(1);
    const [eventName, payload] = webhookService.dispatchEvent.mock.calls[0];
    expect(eventName).toBe("customer.login");
    expect(payload.customer.email).toBe("test@example.com");
    expect(payload.customer.mobile).toBe("+966500000001");
  });

  it("does nothing when store id is missing", async () => {
    const storeLogic = {
      getWebhooks: vi.fn(),
    } as any;
    const webhookService = {
      dispatchEvent: vi.fn(),
    } as any;

    const orchestrator = new SimulatorAuthOrchestrator(
      storeLogic,
      webhookService,
    );
    await orchestrator.dispatchMockLogin(undefined, {});

    expect(storeLogic.getWebhooks).not.toHaveBeenCalled();
    expect(webhookService.dispatchEvent).not.toHaveBeenCalled();
  });
});
