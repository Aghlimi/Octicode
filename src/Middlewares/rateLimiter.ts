import { Request, Response, NextFunction } from 'express';
import { RequestInfo } from '../types';
const storage = new Map<string, RequestInfo>();
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    // Simple in-memory rate limiting (for demonstration purposes only)
    const ip = req.ip || "unknown";
    const now = Date.now();
    const windowTime = 60000;
    const maxRequests = 100;
    const requestInfo = storage.get(ip);

    // for first time visitors
    if (!requestInfo) {
        storage.set(ip, { ip, requestCount: 0, time: now });
        return next();
    }

    // reset count if time window has passed
    if (now - requestInfo!.time >= windowTime) {
        storage.set(ip, { ip, requestCount: 1, time: now });
        return next();
    }

    // rate limit check
    if (requestInfo.requestCount >= maxRequests) {
        return res.status(429).send('Too many requests - try again later');
    } else {
        requestInfo.requestCount += 1;
        storage.set(ip, requestInfo);
    }
    next();
}