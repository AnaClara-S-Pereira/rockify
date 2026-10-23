import { Navigate, useParams, useSearchParams } from "react-router";
import { ErrorNote, Loader } from "../components/ui/Loader";
import { useAsync } from "../hooks/useAsync";
import { resolveByName } from "../services/musicbrainz";

export default function ResolveBandPage() {
  const { name = "" } = useParams();
  const [params] = useSearchParams();
  const search = params.toString();
  const { data, loading, error, reload } = useAsync(() => resolveByName(name), [name]);

  if (loading) return <Loader text={`Procurando ${name}`} />;
  if (error) return <ErrorNote message="O arquivo não respondeu agora." onRetry={reload} />;
  if (!data) return <Navigate to={`/buscar?q=${encodeURIComponent(name)}`} replace />;
  return <Navigate to={`/banda/${data}${search ? `?${search}` : ""}`} replace />;
}
