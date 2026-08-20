"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function CustomersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Customer workspace failed", { digest: error.digest });
  }, [error.digest]);

  return (
    <main className="error-page">
      <div>
        <span><AlertTriangle size={18} /> ÁREA DE CLIENTES</span>
        <h1>Não foi possível carregar os clientes.</h1>
        <p>A ligação pode estar temporariamente indisponível. Tente novamente; os dados guardados não foram alterados.</p>
        <div className="error-actions">
          <button className="button" onClick={reset} type="button"><RotateCcw size={16} />Tentar novamente</button>
          <Link className="text-link" href="/app">Voltar ao painel</Link>
        </div>
      </div>
    </main>
  );
}
