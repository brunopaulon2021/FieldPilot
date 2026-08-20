"use client";

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page"><div><span>ALGO CORREU MAL</span><h1>Não foi possível abrir a área de trabalho.</h1><p>Os seus dados não foram alterados. Tente carregar novamente.</p><button className="button" type="button" onClick={reset}>Tentar novamente</button></div></main>
  );
}
