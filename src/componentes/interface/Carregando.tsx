import Adesivo from "./Adesivo";

// TELA DE CARREGANDO
export function Carregando({ text = "Procurando no arquivo" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-fog" role="status">
      <Adesivo id="vinyl" className="h-20 w-20 animate-spin-slow" />
      <p className="font-type text-lg">
        {text}
        <span className="animate-flicker">...</span>
      </p>
    </div>
  );
}

// AVISO DE ERRO COM BOTÃO DE TENTAR DE NOVO
export function AvisoErro({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="paper mx-auto my-10 max-w-md rotate-[-1.5deg] p-6 text-center shadow-[8px_8px_0_#000]">
      <p className="font-marker text-3xl">Deu ruim.</p>
      <p className="mt-2 font-type">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-bone mt-4">
          Tentar de novo
        </button>
      )}
    </div>
  );
}
