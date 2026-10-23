<h1>
  <img src="public/favicon.svg" alt="Logo do Rockify" height="34" align="top">
  Rockify
</h1>

Um site de música para quem gosta de rock, metal, punk e cenas alternativas. Você pesquisa qualquer banda do mundo e vê a formação, a discografia e prévias das músicas. A parte principal é o Livro Negro, que monta o dossiê de cada integrante, com infância, biografia, vida pessoal e polêmicas.

O visual imita um fanzine fotocopiado, em preto, branco e cinza, com adesivos arrastáveis, fotos com efeito xerox, letras recortadas de revista e as polêmicas marcadas em vermelho.

## O que o site faz

**Busca.** Procura bandas por nome ou por gênero e esconde resultados repetidos. O botão "Desenterrar" sorteia uma página lá no fundo de um gênero, para achar bandas que quase ninguém conhece.

**Página da banda.** Mostra foto, história, links oficiais, formação, as músicas mais tocadas com player de 30 segundos e a discografia. Cada disco abre com a lista de faixas e prévias.

**Livro Negro.** Aceita o nome de qualquer banda ou integrante e abre o dossiê dele em formato de livro: ficha, fotos de infância e atuais, curiosidades, polêmicas em vermelho, biografia em capítulos e um arquivo de fotos. Há algumas bandas de exemplo no início da página.

**Quiz.** Vinte perguntas que revelam seu perfil entre 13 tribos musicais, com um patch para o perfil e recomendações de bandas e músicas.

**Perfil.** Cadastro e login, foto e banner enviados do computador (ou opções prontas), bio, o que está tocando na sua cabeça e as bandas favoritas.

**Player.** Um player fixo no rodapé toca as prévias em qualquer página, com fila, pausa e barra de progresso.

## Como o dossiê é montado

Nenhuma banda é cadastrada à mão. A formação vem do MusicBrainz e, quando ele conhece poucos integrantes, é completada pelo Wikidata e pela lista de integrantes da Wikipedia. Infância, biografia e vida pessoal vêm da Wikipedia em português, com a versão em inglês traduzida para preencher o que faltar. As polêmicas são de cada integrante e juntam trechos da Wikipedia com manchetes da imprensa. Tudo aparece em português.

## Tecnologias

**Interface**
- React 19, com componentes e hooks
- TypeScript em modo estrito
- Tailwind CSS 4, com o tema, as cores e as animações definidos no CSS
- React Router 7, para as rotas e o histórico de navegação
- Vite 7, para o servidor de desenvolvimento e o build

Não há bibliotecas de animação, de ícones ou de componentes. Os adesivos, os ícones, os filtros xerox (SVG) e as animações são feitos à mão em SVG e CSS. As fontes são Anton, Permanent Marker, Special Elite, Space Grotesk e UnifrakturCook, carregadas pelo Google Fonts.

**Funções do servidor**
- Duas funções na pasta `api/`, rodando no Vercel e também no `npm run dev`: uma reúne manchetes e pesquisas sobre a pessoa, a outra busca fotos.

**Armazenamento**
- O login e o perfil ficam no `localStorage` do navegador, com a senha guardada como hash (SHA-256). As respostas das APIs ficam em cache na sessão.

## APIs usadas

- **MusicBrainz.** Busca de bandas, integrantes, discografia e faixas.
- **Wikidata.** Datas de nascimento e morte, família, prêmios e fotos principais.
- **Wikipedia (português e inglês).** Biografia, imagens das páginas e busca de menções.
- **Wikimedia Commons.** Fotos com data, usadas para achar imagens de infância e juventude.
- **Cover Art Archive.** Capas dos discos.
- **Deezer.** Fotos das bandas, capas que faltam e prévias de 30 segundos das músicas.
- **Google Notícias (RSS).** Manchetes sobre polêmicas, vida pessoal e infância.
- **Google Tradutor (endpoint público).** Tradução do que vem em inglês.
- **Serper.dev (opcional).** Busca de fotos no Google Imagens.
- **Gemini, do Google (opcional).** Pesquisa mais ampla sobre a pessoa, com busca na web.
- **YouTube.** Os botões de vídeo abrem a busca correspondente.

O MusicBrainz aceita no máximo um pedido por segundo, então o site mantém uma fila por servidor e repete sozinho os pedidos barrados por limite de uso.

## Como rodar

É preciso ter o Node 20 ou mais novo.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:5173`. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

Para publicar, é só enviar o projeto para o Vercel. O `vercel.json` já cuida das rotas e das funções.

## Chaves opcionais

O site funciona sem nenhuma chave. Elas só deixam o Livro Negro mais completo. Crie um arquivo `.env` na mesma pasta do `package.json`:

```
SERPER_API_KEY=sua-chave
GEMINI_API_KEY=sua-chave
```

`SERPER_API_KEY` liga a busca de fotos de infância e atuais (chave grátis em serper.dev). `GEMINI_API_KEY` liga uma pesquisa mais ampla de polêmicas, vida pessoal e biografia (chave grátis em aistudio.google.com). No Vercel, as mesmas variáveis ficam em Settings, Environment Variables. O `.env` já está no `.gitignore`.

## Estrutura

```
api/        funções do servidor (pesquisa sobre a pessoa e busca de fotos)
src/
  components/   peças da interface
  context/      usuário logado e player
  data/         bandas de exemplo, gêneros e quiz
  hooks/        carregamento de dados e montagem do dossiê
  lib/          cache, fila de pedidos e utilidades
  pages/        uma página por rota
  services/     acesso às APIs e login
  styles/       tema e efeitos visuais
```
