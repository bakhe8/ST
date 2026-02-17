import crypto from 'crypto';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { WebhookSubscription } from '@vtdr/contracts';

export class WebhookService {
    /**
     * Dispatches a webhook event to all active subscriptions in a store context.
     */
    public async dispatchEvent(event: string, payload: any, subscriptions: WebhookSubscription[]) {
        const activeSubs = subscriptions.filter(s => s.isActive && s.events.includes(event));

        console.log(`[Webhook] Dispatching '${event}' to ${activeSubs.length} subscriptions`);

        const promises = activeSubs.map(sub => this.sendWebhook(sub, event, payload));
        await Promise.allSettled(promises);
    }

    /**
     * Sends a single webhook request with HMAC signature
     */
    private async sendWebhook(subscription: WebhookSubscription, event: string, payload: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = new URL(subscription.url);
            const body = JSON.stringify({
                event,
                payload,
                timestamp: Math.floor(Date.now() / 1000)
            });

            // Calculate Salla Signature
            const signature = crypto
                .createHmac('sha256', subscription.secret)
                .update(body)
                .digest('hex');

            const options = {
                hostname: url.hostname,
                port: url.port || (url.protocol === 'https:' ? 443 : 80),
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                    'X-Salla-Signature': signature,
                    'X-Salla-Event': event,
                    'User-Agent': 'Salla-Simulator/1.0'
                }
            };

            const protocol = url.protocol === 'https:' ? https : http;
            const req = protocol.request(options, (res) => {
                console.log(`[Webhook] Sent to ${subscription.url} - Status: ${res.statusCode}`);
                resolve();
            });

            req.on('error', (e) => {
                console.error(`[Webhook] Error sending to ${subscription.url}:`, e.message);
                resolve(); // Don't block overall execution on failure
            });

            req.write(body);
            req.end();
        });
    }
}
