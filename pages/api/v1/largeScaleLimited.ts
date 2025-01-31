import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

type ApiResponse = {
  timestamp: number;
  message: string;
};

const requestLimit = 5; 
let requestCount = 0; 
let lastResetTime = Date.now(); 

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const cacheKey = "large_scale_timestamp"; 
  const cachedTimestamp = await redis.get<number>(cacheKey); 

  if (Date.now() - lastResetTime > 1000) {
    requestCount = 0;
    lastResetTime = Date.now(); 
  }

  if (requestCount >= requestLimit) {
    return res.status(429).json({ 
      timestamp: Date.now(),
      message: "Too many requests, please try again later." 
    });
  }

  requestCount++; // Incrementa o contador de requisições

  if (cachedTimestamp) {
    return res.status(200).json({ timestamp: Date.now(), message: "potato potato" });
  }
  const message = "potato potato"; 

  await redis.set(cacheKey, Date.now(), { ex: 10 });

  res.status(200).json({ timestamp: Date.now(), message });
}
