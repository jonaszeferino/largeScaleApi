"use client";

import { useState } from "react";
import styles from "./page.module.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"; // URL base

export default function Home() {
  const [numRequests, setNumRequests] = useState(0); // Campo para número de requisições
  const [result, setResult] = useState<string | null>(null); // Resultado consolidado
  const [responses, setResponses] = useState<string[]>([]); // Lista de respostas das requisições
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({}); // Contador de status

  const handleTest = async (endpoint: string) => {
    if (!numRequests || numRequests <= 0 || numRequests > 1000) {
      alert("Please enter a valid number of requests (1 to 1000).");
      return;
    }

    setLoading(true);
    setResult(null);
    setResponses([]);
    setStatusCounts({});
    const startTime = Date.now();
    let completedRequests = 0;

    const tempResponses: string[] = [];
    const tempStatusCounts: Record<string, number> = {};

    const promises = Array.from({ length: numRequests }).map(async (_, index) => {
      try {
        const startRequestTime = Date.now();
        const response = await fetch(`${BASE_URL}/${endpoint}`);
        const duration = Date.now() - startRequestTime;

        const status = response.status.toString();
        tempResponses.push(`Request ${index + 1}: ${status} (${duration}ms)`);


        if (tempStatusCounts[status]) {
          tempStatusCounts[status]++;
        } else {
          tempStatusCounts[status] = 1;
        }

        completedRequests++;

        setResponses([...tempResponses]);
        setStatusCounts({ ...tempStatusCounts });
      } catch (error) {
        const errorMessage = `Request ${index + 1}: Failed (${error instanceof Error ? error.message : 'Unknown error'})`;
        tempResponses.push(errorMessage);

        if (tempStatusCounts["Failed"]) {
          tempStatusCounts["Failed"]++;
        } else {
          tempStatusCounts["Failed"] = 1;
        }
        setResponses([...tempResponses]);
        setStatusCounts({ ...tempStatusCounts });
      }
    });

    await Promise.all(promises); // Aguarda todas as requisições serem concluídas

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;
    const rps = (completedRequests / durationInSeconds).toFixed(2);
    const statusAverages: Record<string, number> = {};

    // Calcula a média para cada status
    for (const [status, count] of Object.entries(tempStatusCounts)) {
      statusAverages[status] = (count / completedRequests) * 100; // Média em porcentagem
    }

    setResult(
      `Completed ${completedRequests} requests in ${durationInSeconds.toFixed(
        2
      )} seconds. (${rps} requests/second)`
    );
    setStatusCounts(statusAverages); // Atualiza o estado com as médias
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Scalability Test Methods</h1>
        <p className={styles.description}>
          This project demonstrates 3 methods for handling GET requests:
        </p>
        <ul className={styles.list}>
          <li>
            <strong>/largeScale:</strong> Handles{" "}
            <span className={styles.highlight}>650 requests per second - with cache</span>.
            <div className={styles.actions}>
              <input
                type="number"
                placeholder="Number of requests (1-1000)"
                className={styles.input}
                onChange={(e) => setNumRequests(Number(e.target.value))}
                max="1000"
              />
              <button
                className={styles.button}
                onClick={() => handleTest("largeScale")}
                disabled={loading}
              >
                Test /largeScale
              </button>
            </div>
          </li>
          <li>
            <strong>/largeScaleLimited:</strong>{" "}
            <span className={styles.highlight}>A limited method 10 per second</span>.
            <div className={styles.actions}>
              <input
                type="number"
                placeholder="Number of requests (1-1000)"
                className={styles.input}
                onChange={(e) => setNumRequests(Number(e.target.value))}
                max="1000"
              />
              <button
                className={styles.button}
                onClick={() => handleTest("largeScaleLimited")}
                disabled={loading}
              >
                Test /largeScaleLimited
              </button>
            </div>
          </li>
          <li>
            <strong>/largeScaleNoCache:</strong>{" "}
            <span className={styles.highlight}>200 requests per second - no cache</span>.
            <div className={styles.actions}>
              <input
                type="number"
                placeholder="Number of requests (1-1000)"
                className={styles.input}
                onChange={(e) => setNumRequests(Number(e.target.value))}
                max="1000"
              />
              <button
                className={styles.button}
                onClick={() => handleTest("largeScaleNoCache")}
                disabled={loading}
              >
                Test /largeScaleNoCache
              </button>
            </div>
          </li>
        </ul>
        {loading && <p className={styles.loading}>Running test...</p>}
        {result && (
          <>
            <p className={styles.result}>{result}</p>
            <h3>Média por Status:</h3>
            <ul>
              {Object.entries(statusCounts).map(([status, average]) => (
                <li key={status}>
                  {status}: {average.toFixed(2)}%
                </li>
              ))}
            </ul>
          </>
        )}
        {Object.keys(statusCounts).length > 0 && (
          <div className={styles.statusCounts}>
            <h3>Status Counts:</h3>
            <ul>
              {Object.entries(statusCounts).map(([status, count]) => (
                <li key={status}>
                  {status}: {count}
                </li>
              ))}
            </ul>
          </div>
        )}
        {responses.length > 0 && (
          <div className={styles.responseList}>
            <h3>Request Details:</h3>
            <ul>
              {responses.map((response, index) => (
                <li key={index} className={styles.responseItem}>
                  {response}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2025 Jonas Zeferino - Scalability Testing Project</p>
      </footer>
    </div>
  );
}