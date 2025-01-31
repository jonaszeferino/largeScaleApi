import type { NextApiRequest, NextApiResponse } from "next";

type ApiResponse = {
  timestamp: number;
  message: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const timestamp = Date.now();
  const message = `You hit the API at ${new Date(timestamp).toISOString()}`;

  res.status(200).json({ timestamp, message });
}