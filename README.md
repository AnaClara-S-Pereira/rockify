# Rockify

Um site de música para quem gosta de rock, metal, punk e cenas alternativas. Permite pesquisar qualquer banda do mundo e consultar a formação, a discografia e prévias das músicas. A principal funcionalidade é o Livro Negro, que monta automaticamente um dossiê de cada integrante, com infância, biografia, vida pessoal e polêmicas.

O visual segue a estética de fanzine fotocopiado, em preto, branco e cinza, com adesivos que podem ser arrastados, fotos com efeito xerox e as polêmicas destacadas em vermelho.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Como funciona o Livro Negro](#como-funciona-o-livro-negro)
- [Como rodar](#como-rodar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Fontes de dados](#fontes-de-dados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)

## Funcionalidades

| Página | Rota | Descrição |
| --- | --- | --- |
| Início | `/` | Título em destaque, adesivos arrastáveis, mural de bandas, fitas cassete por gênero e chamadas para o quiz e o Livro Negro |
| Buscar | `/buscar` | Busca por nome ou gênero, sem resultados repetidos, e o botão "Desenterrar", que sorteia bandas pouco conhecidas |
| Banda | `/banda/:id` | Foto, história, links oficiais, formação, músicas mais tocadas com player e discografia com a lista de faixas |
| Dossiê | `/banda/:id/membro/:id` | Ficha completa de um integrante, aberta em tela cheia |
| Livro Negro | `/livro-negro` | Pesquisa de qualquer banda ou integrante, com algumas bandas de exemplo no início |
| Quiz | `/quiz` | 20 perguntas, 13 perfis musicais e recomendações de bandas e músicas |
| Conta | `/entrar`, `/cadastro` | Login e cadastro |
| Perfil | `/perfil` | Foto e banner (do computador ou prontos), bio, status, resultado do quiz e bandas favoritas |
| Atalho | `/b/Nome da Banda` | Localiza a banda pelo nome e redireciona para a página dela |

## Como funciona o Livro Negro

Nenhuma banda é cadastrada à mão. Ao pesquisar, o site monta a formação e, para cada integrante, o dossiê:

- **Formação:** vem do MusicBrainz. Quando ele lista menos de duas pessoas, o site completa com o Wikidata e com a lista de integrantes da Wikipedia.
- **Infância, biografia e vida pessoal:** vêm da Wikipedia em português e, quando faltam seções, da versão em inglês, traduzida. Dados do Wikidata (pais, irmãos, cônjuge, filhos) e do MusicBrainz completam o que a Wikipedia não tem. Nenhum integrante fica sem essas três seções.
- **Polêmicas:** são específicas de cada integrante. Reúnem trechos da Wikipedia e manchetes da imprensa que citam a pessoa pelo nome. Em bandas de até duas pessoas, as polêmicas da dupla valem para as duas.
- **Fotos:** a foto atual vem do Wikidata, da Wikipedia ou do Wikimedia Commons. A foto de infância ou adolescência (até 19 anos) é encontrada comparando a data da foto com a data de nascimento. Com as chaves de busca de imagens configuradas, o site também procura no Google Imagens, aceitando apenas resultados cujo título cita o nome e a banda.
- **Navegação:** o botão Voltar do dossiê retorna à página de onde a pessoa veio. A pesquisa do Livro Negro fica na URL, então a lista de integrantes continua na tela ao voltar.

Tudo é exibido em português. O que vem em inglês é traduzido, e se a tradução falhar o trecho é descartado.

As bandas de exemplo do início do Livro Negro ficam em `src/data/dossies.ts`: Nirvana, Metallica, Black Sabbath, Ramones, The Cure, Sepultura, Iron Maiden e Joy Division. Esse arquivo serve só de vitrine e não é usado para as demais bandas.

## Como rodar

É necessário Node 20 ou mais recente.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:5173`. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

Para publicar, basta enviar o projeto ao Vercel. O arquivo `vercel.json` já trata as rotas e publica as funções da pasta `api/`.

## Variáveis de ambiente

O site funciona sem nenhuma variável. As abaixo são opcionais e deixam o Livro Negro mais completo. No Vercel, elas ficam em Settings, Environment Variables. Para rodar localmente, crie um arquivo `.env` na raiz do projeto (o mesmo diretório do `package.json`).

| Variável | Para que serve |
| --- | --- |
| `SERPER_API_KEY` | Liga a busca de fotos no Google Imagens por meio do serper.dev, que oferece uma chave gratuita com 2.500 buscas |
| `GOOGLE_CSE_KEY` e `GOOGLE_CSE_ID` | Alternativa à de cima: a API oficial Programmable Search do Google. Só funciona em projetos que ainda tenham acesso à Custom Search API |
| `GEMINI_API_KEY` | Liga a pesquisa do Gemini com busca do Google para polêmicas, vida pessoal, infância e biografia. Chave gratuita em aistudio.google.com |
| `GEMINI_MODEL` | Troca o modelo do Gemini. O padrão é `gemini-2.5-flash` |

Exemplo de `.env`:

```
SERPER_API_KEY=sua-chave
GEMINI_API_KEY=sua-chave
```

Nunca publique esse arquivo. Ele já está no `.gitignore`.

## Fontes de dados

| Fonte | Uso |
| --- | --- |
| MusicBrainz | Busca de bandas, integrantes, discografia e faixas |
| Wikidata e Wikipedia | Fotos, datas, família, biografia e galeria de imagens |
| Wikimedia Commons | Fotos com data, usadas para achar imagens de juventude |
| Cover Art Archive e Deezer | Capas dos discos |
| Deezer | Fotos das bandas e prévias de 30 segundos |
| Google Notícias (RSS) | Manchetes sobre polêmicas, vida pessoal e infância |
| Google Imagens (opcional) | Fotos que não existem nas fontes livres |
| YouTube | Os botões de vídeo abrem a busca correspondente |

Cada servidor tem a própria fila de pedidos e o MusicBrainz recebe no máximo um por segundo. Respostas com limite de uso (429 ou 503) são repetidas automaticamente, e tudo fica em cache durante a sessão.

As funções da pasta `api/` rodam no Vercel e também com `npm run dev`. Em outra hospedagem elas ficam indisponíveis, e o dossiê usa apenas Wikipedia, Wikidata e MusicBrainz.

## Estrutura do projeto

```
api/                funções do servidor
  pessoa.ts         manchetes da imprensa e pesquisa do Gemini
  fotos.ts          busca de fotos no Google Imagens
src/
  components/       band, home, layout, profile, quiz e ui (adesivos, foto xerox, letras recortadas)
  context/          usuário logado e player de música
  data/             bandas de exemplo, gêneros, quiz e mural
  hooks/            carregamento assíncrono, dados do dossiê, fotos de bandas
  lib/              cache e fila de pedidos, utilidades de texto
  pages/            uma página por rota
  services/         MusicBrainz, Wikipedia, Wikidata, Deezer, dossiê, formação e autenticação
  styles/           tema do Tailwind e efeitos visuais
```

## Login e cadastro

O login funciona, mas os dados ficam no `localStorage` do navegador e a senha é guardada como hash. Isso atende a um projeto de portfólio. Para contas reais, é possível trocar as funções de `src/services/auth.ts` por Supabase ou Firebase, sem alterar o resto do site.

## Tecnologias

React 19, TypeScript, Tailwind CSS 4, React Router 7 e Vite. Não há bibliotecas de animação ou de ícones: os adesivos, os ícones e as animações são feitos à mão em SVG e CSS.
