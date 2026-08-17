import { createHmac, randomUUID } from "node:crypto";

export const INTERNAL_REVIEW_SOURCE = "swell-campaign-hub";
export const INTERNAL_REVIEW_EVENT_TYPE = "internal_review_requested";

type Environment = Record<string, string | undefined>;

type FetchResponse = {
  ok: boolean;
  status: number;
};

type FetchImplementation = (input: string, init: RequestInit) => Promise<FetchResponse>;

export type InternalReviewEvent = {
  event_id: string;
  source: typeof INTERNAL_REVIEW_SOURCE;
  event_type: typeof INTERNAL_REVIEW_EVENT_TYPE;
};

export function createInternalReviewEvent(eventId = `hub-review-${randomUUID()}`): InternalReviewEvent {
  return {
    event_id: eventId,
    source: INTERNAL_REVIEW_SOURCE,
    event_type: INTERNAL_REVIEW_EVENT_TYPE,
  };
}

function getHandoffConfiguration(environment: Environment) {
  const webhookUrl = environment.ACTIVEPIECES_WEBHOOK_URL?.replace(/\/$/, "");
  const hmacSecret = environment.ACTIVEPIECES_HMAC_SECRET;

  if (!webhookUrl || !hmacSecret) {
    throw new Error("The internal review handoff is not configured.");
  }

  return { webhookUrl, hmacSecret };
}

export async function dispatchInternalReviewEvent({
  environment = process.env,
  event = createInternalReviewEvent(),
  fetchImplementation = fetch,
}: {
  environment?: Environment;
  event?: InternalReviewEvent;
  fetchImplementation?: FetchImplementation;
} = {}) {
  const { webhookUrl, hmacSecret } = getHandoffConfiguration(environment);
  const body = JSON.stringify(event);
  const signature = createHmac("sha256", hmacSecret).update(body).digest("hex");
  const response = await fetchImplementation(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-signature": signature,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`The internal review handoff was rejected with HTTP ${response.status}.`);
  }

  return {
    eventId: event.event_id,
    status: response.status,
  };
}
