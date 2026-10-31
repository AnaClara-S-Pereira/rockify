import { useCallback, useEffect, useState, type DependencyList } from "react";

// RODA UMA FUNÇÃO ASSÍNCRONA E DEVOLVE DADOS, CARREGAMENTO E ERRO
// "CARREGANDO" FICA VERDADEIRO NA HORA QUE AS DEPENDÊNCIAS MUDAM, SEM RESTO DE DADO DO PEDIDO ANTERIOR
export function useAssincrono<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [tick, setTick] = useState(0);
  const [done, setDone] = useState<{ key: string; data?: T; error: Error | null }>({ key: "", error: null });
  const key = `${JSON.stringify(deps)}#${tick}`;

  useEffect(() => {
    let alive = true;
    fn()
      .then((data) => alive && setDone({ key, data, error: null }))
      .catch((err: unknown) => alive && setDone({ key, error: err instanceof Error ? err : new Error(String(err)) }));
    return () => {
      alive = false;
    };
  }, [key]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const fresh = done.key === key;
  return { data: fresh ? done.data : undefined, loading: !fresh, error: fresh ? done.error : null, reload };
}
