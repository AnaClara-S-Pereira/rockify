<h1>
  <img src="public/favicon.svg" alt="Logo do Rockify" height="34" align="top">
  Rockify
</h1>

Um site de música para quem gosta de rock, metal, punk e cenas alternativas. Você pesquisa qualquer banda ou artista do mundo e vê a formação, a discografia e prévias das músicas. A parte principal é o Livro Negro: um dossiê de cada integrante, com infância, biografia, vida pessoal e polêmicas.

O visual é inspirado em fanzines fotocopiados: fundo preto, letras recortadas de revista, adesivos arrastáveis e as polêmicas marcadas em vermelho. As fotos são coloridas e viram xerox em preto e branco quando o mouse passa por cima.

## Funcionalidades

**Busca.** Procura bandas e artistas por nome ou por gênero, sem resultados repetidos. Os gêneros de rock ficam à mostra e outros, como MPB, pop, hip hop e samba, ficam atrás de um botão. O botão "Desenterrar" sorteia uma página do fundo de um gênero para você achar nomes que quase ninguém conhece.

**Página da banda.** Foto, história, links oficiais, formação, músicas mais tocadas com player de 30 segundos e discografia. Cada disco abre com a lista de faixas.

**Livro Negro.** Pesquisa qualquer banda ou integrante e abre o dossiê dele em formato de livro, com ficha, fotos de infância e atuais, curiosidades, biografia em capítulos, polêmicas em destaque e um arquivo de fotos. Algumas bandas de exemplo aparecem no início da página.

**Quiz.** Vinte perguntas que descobrem seu perfil entre 13 tribos musicais, com um selo para o perfil e recomendações de bandas e músicas.

**Perfil.** Cadastro e login, foto e banner enviados do computador, bio, o que está tocando na sua cabeça e suas bandas favoritas.

**Player.** Um player fixo no rodapé toca as prévias em qualquer página, com fila, pausa e barra de progresso.

## Tecnologias

- React 19
- TypeScript
- Tailwind CSS 4
- React Router 7
- Vite 7
- Funções serverless na pasta `api/`, publicadas no Vercel

Os adesivos, os ícones, os filtros de efeito xerox e as animações foram desenhados em SVG e CSS. As fontes são Anton, Permanent Marker, Special Elite, Space Grotesk e UnifrakturCook, do Google Fonts.

## Fontes de dados

O site reúne informações de bases abertas e de serviços públicos:

- **MusicBrainz:** bandas, integrantes, discografia e faixas
- **Wikidata, Wikipedia e Wikimedia Commons:** dados biográficos e fotos
- **Cover Art Archive e Deezer:** capas dos discos, fotos das bandas e prévias das músicas
- **Google Notícias (RSS):** manchetes da imprensa
- **Serper.dev e Gemini (opcionais):** busca de fotos e pesquisa complementar

As informações do dossiê vêm dessas fontes e podem conter erros ou lacunas. Polêmicas citadas são acusações ou notícias publicadas, não fatos comprovados.

## Como rodar

É preciso ter o Node 20 ou mais recente.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:5173`. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

Para publicar, basta enviar o projeto ao Vercel. O arquivo `vercel.json` já cuida das rotas e das funções.

## Chaves opcionais

O site funciona sem nenhuma chave. Elas só ampliam o Livro Negro. Para usá-las, crie um arquivo `.env` na mesma pasta do `package.json`:

```
SERPER_API_KEY=sua-chave
GEMINI_API_KEY=sua-chave
```

- `SERPER_API_KEY` liga a busca de fotos no Google Imagens (chave gratuita em serper.dev).
- `GEMINI_API_KEY` liga uma pesquisa mais ampla sobre cada pessoa (chave gratuita em aistudio.google.com).

No Vercel, as mesmas variáveis ficam em Settings, Environment Variables. O `.env` já está no `.gitignore` e nunca deve ser publicado.

## Estrutura do projeto

```
api/            funções do servidor
src/
  componentes/  peças da interface (banda, inicio, estrutura, perfil, quiz e interface)
  contexto/     usuário logado e player
  dados/        bandas de exemplo, gêneros e perguntas do quiz
  estilos/      tema e efeitos visuais
  hooks/        carregamento de dados e montagem do dossiê
  paginas/      uma página por rota
  servicos/     acesso às fontes de dados e login
  tipos/        tipos do TypeScript
  utilitarios/  funções de apoio
```

## Autora

Feito por Ana Clara ([GitHub](https://github.com/AnaClara-S-Pereira) · [LinkedIn](https://www.linkedin.com/in/ana-pereira-dev/)).
