import { BrowserRouter, Route, Routes } from "react-router";
import Estrutura from "./componentes/estrutura/Estrutura";
import { ProvedorUsuario } from "./contexto/ContextoUsuario";
import { ProvedorPlayer } from "./contexto/ContextoPlayer";
import PaginaBanda from "./paginas/PaginaBanda";
import PaginaLivroNegro from "./paginas/PaginaLivroNegro";
import PaginaInicial from "./paginas/PaginaInicial";
import PaginaLogin from "./paginas/PaginaLogin";
import PaginaNaoEncontrada from "./paginas/PaginaNaoEncontrada";
import PaginaPerfil from "./paginas/PaginaPerfil";
import PaginaQuiz from "./paginas/PaginaQuiz";
import PaginaAtalhoBanda from "./paginas/PaginaAtalhoBanda";
import PaginaBusca from "./paginas/PaginaBusca";
import PaginaCadastro from "./paginas/PaginaCadastro";

export default function App() {
  return (
    <ProvedorUsuario>
      <ProvedorPlayer>
        <BrowserRouter>
          <Routes>
            <Route element={<Estrutura />}>
              <Route index element={<PaginaInicial />} />
              <Route path="buscar" element={<PaginaBusca />} />
              <Route path="b/:name" element={<PaginaAtalhoBanda />} />
              <Route path="banda/:mbid" element={<PaginaBanda />} />
              <Route path="banda/:mbid/membro/:memberId" element={<PaginaBanda />} />
              <Route path="livro-negro" element={<PaginaLivroNegro />} />
              <Route path="quiz" element={<PaginaQuiz />} />
              <Route path="entrar" element={<PaginaLogin />} />
              <Route path="cadastro" element={<PaginaCadastro />} />
              <Route path="perfil" element={<PaginaPerfil />} />
              <Route path="*" element={<PaginaNaoEncontrada />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProvedorPlayer>
    </ProvedorUsuario>
  );
}
