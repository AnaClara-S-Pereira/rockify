import { Navigate, useParams, useSearchParams } from "react-router";
import { AvisoErro, Carregando } from "../componentes/interface/Carregando";
import { useAssincrono } from "../hooks/useAssincrono";
import { resolveByName } from "../servicos/musicbrainz";

// ATALHO /b/NOME: ACHA A BANDA PELO NOME E REDIRECIONA MANTENDO OS PARÂMETROS
export default function PaginaAtalhoBanda() {
  const { name = "" } = useParams();
  const [params] = useSearchParams();
  const search = params.toString();
  const { data, loading, error, reload } = useAssincrono(() => resolveByName(name), [name]);

  if (loading) return <Carregando text={`Procurando ${name}`} />;
  if (error) return <AvisoErro message="O arquivo não respondeu agora." onRetry={reload} />;
  if (!data) return <Navigate to={`/buscar?q=${encodeURIComponent(name)}`} replace />;
  return <Navigate to={`/banda/${data}${search ? `?${search}` : ""}`} replace />;
}
