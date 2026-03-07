import { createConsumer } from "@rails/actioncable";
import { getAccessToken } from "@/utils/tokens";

let consumer: ReturnType<typeof createConsumer> | null = null;

export function getCableConsumer() {
  if (!consumer) {
    const wsBase =
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3000/cable";
    consumer = createConsumer(() => {
      const token = getAccessToken();
      return `${wsBase}${token ? `?token=${token}` : ""}`;
    });
  }
  return consumer;
}
