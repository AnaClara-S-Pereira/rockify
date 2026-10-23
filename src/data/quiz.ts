import type { QuizQuestion } from "../types";

// PERGUNTAS DO QUIZ
export const QUIZ: QuizQuestion[] = [
  {
    pergunta: "Sexta à noite. Cadê você?",
    opcoes: [
      { texto: "Num show de porão, suado, sem celular", pontos: { punk: 3, emo: 1, extremo: 1 } },
      { texto: "No bar com jukebox pedindo o mesmo hino de novo", pontos: { classico: 3, heavy: 1 } },
      { texto: "Em casa, luz apagada, fone gigante", pontos: { shoegaze: 3, postpunk: 1, alternativo: 1 } },
      { texto: "Numa festa que só toca coisa dos anos 2000", pontos: { numetal: 3, emo: 2 } },
    ],
  },
  {
    pergunta: "Escolhe uma peça de roupa pra vida toda:",
    opcoes: [
      { texto: "Jaqueta de couro cheia de patch", pontos: { heavy: 3, thrash: 2 } },
      { texto: "Camisa xadrez de flanela", pontos: { grunge: 3, doom: 1 } },
      { texto: "Tudo preto, de preferência com renda", pontos: { postpunk: 3, extremo: 1 } },
      { texto: "Moletom com capuz e calça larga", pontos: { numetal: 3, emo: 1 } },
    ],
  },
  {
    pergunta: "Qual instrumento você roubaria do palco?",
    opcoes: [
      { texto: "O baixo, óbvio. O baixo manda.", pontos: { postpunk: 3, doom: 1, prog: 1 } },
      { texto: "A guitarra com o maior número de pedais", pontos: { shoegaze: 3, alternativo: 1 } },
      { texto: "A bateria com dois bumbos", pontos: { thrash: 2, extremo: 3 } },
      { texto: "O microfone, pra gritar umas verdades", pontos: { punk: 3, emo: 2 } },
    ],
  },
  {
    pergunta: "Música boa tem que durar quanto tempo?",
    opcoes: [
      { texto: "1 minuto e meio. Mais que isso é enrolação.", pontos: { punk: 3, extremo: 1 } },
      { texto: "Uns 4 minutos com um refrão que gruda", pontos: { alternativo: 2, grunge: 2, numetal: 1 } },
      { texto: "8 minutos com solo no meio", pontos: { classico: 2, heavy: 2, thrash: 1 } },
      { texto: "20 minutos, dividida em 5 atos", pontos: { prog: 3, doom: 2 } },
    ],
  },
  {
    pergunta: "Seu clima ideal:",
    opcoes: [
      { texto: "Chuva fina e cinza, o dia todo", pontos: { grunge: 3, postpunk: 2 } },
      { texto: "Deserto, 40 graus, poeira no rosto", pontos: { doom: 3, classico: 1 } },
      { texto: "Floresta congelada às 3 da manhã", pontos: { extremo: 3, shoegaze: 1 } },
      { texto: "Cidade grande, neon e trânsito", pontos: { alternativo: 2, numetal: 2, emo: 1 } },
    ],
  },
  {
    pergunta: "O que mais te irrita num show?",
    opcoes: [
      { texto: "Gente parada. Abre essa roda!", pontos: { thrash: 3, punk: 2 } },
      { texto: "Gente conversando na música lenta", pontos: { shoegaze: 2, prog: 2, postpunk: 1 } },
      { texto: "Som baixo. Quero sentir no peito.", pontos: { doom: 2, extremo: 2, heavy: 1 } },
      { texto: "Ninguém cantando junto o refrão", pontos: { emo: 3, numetal: 1, classico: 1 } },
    ],
  },
  {
    pergunta: "Escolhe uma capa de disco:",
    opcoes: [
      { texto: "Uma ilustração épica com caveira e fogo", pontos: { heavy: 3, thrash: 2 } },
      { texto: "Uma foto borrada e misteriosa", pontos: { shoegaze: 3, alternativo: 1 } },
      { texto: "Um logo ilegível em cima de uma floresta", pontos: { extremo: 3 } },
      { texto: "Uma colagem xerocada e torta", pontos: { punk: 3, postpunk: 1 } },
    ],
  },
  {
    pergunta: "Você ganhou um carro. Toca o quê?",
    opcoes: [
      { texto: "Fita cassete de rock dos anos 70", pontos: { classico: 3, prog: 1 } },
      { texto: "Riff arrastado no talo, janela aberta", pontos: { doom: 3, grunge: 1 } },
      { texto: "Um CD riscado que você gritava aos 14", pontos: { emo: 2, numetal: 3 } },
      { texto: "Algo que ninguém no carro conhece", pontos: { alternativo: 3, shoegaze: 1 } },
    ],
  },
  {
    pergunta: "Qual frase te define?",
    opcoes: [
      { texto: "\"Faça você mesmo.\"", pontos: { punk: 3, emo: 1 } },
      { texto: "\"Mais alto. Mais rápido. Mais pesado.\"", pontos: { thrash: 3, extremo: 2 } },
      { texto: "\"A tristeza também dança.\"", pontos: { postpunk: 3, shoegaze: 1 } },
      { texto: "\"O riff é eterno.\"", pontos: { heavy: 2, classico: 2, doom: 1 } },
    ],
  },
  {
    pergunta: "Como você lida com raiva?",
    opcoes: [
      { texto: "Grito no travesseiro (ou no microfone)", pontos: { numetal: 3, emo: 2 } },
      { texto: "Corro na roda punk até cansar", pontos: { punk: 2, thrash: 3 } },
      { texto: "Escrevo um poema sombrio", pontos: { postpunk: 2, grunge: 2 } },
      { texto: "Deito e deixo o barulho me engolir", pontos: { shoegaze: 2, doom: 2 } },
    ],
  },
  {
    pergunta: "Qual década você visitaria?",
    opcoes: [
      { texto: "Anos 70", pontos: { classico: 3, prog: 2, heavy: 1 } },
      { texto: "Anos 80", pontos: { thrash: 2, postpunk: 2, heavy: 1, punk: 1 } },
      { texto: "Anos 90", pontos: { grunge: 3, alternativo: 2, shoegaze: 1, extremo: 1 } },
      { texto: "Anos 2000", pontos: { numetal: 3, emo: 3 } },
    ],
  },
  {
    pergunta: "Escolhe um superpoder:",
    opcoes: [
      { texto: "Tocar qualquer solo de primeira", pontos: { heavy: 2, prog: 2, thrash: 1 } },
      { texto: "Ficar invisível na multidão", pontos: { shoegaze: 2, postpunk: 2 } },
      { texto: "Voz que derruba prédio", pontos: { extremo: 2, numetal: 2, heavy: 1 } },
      { texto: "Viajar no tempo pra ver shows lendários", pontos: { classico: 3, grunge: 1 } },
    ],
  },
  {
    pergunta: "Letra boa fala de quê?",
    opcoes: [
      { texto: "Política, sistema e indignação", pontos: { punk: 3, thrash: 1 } },
      { texto: "Sentimentos que eu não sei explicar", pontos: { emo: 3, grunge: 1, shoegaze: 1 } },
      { texto: "Mitologia, guerra, fantasia", pontos: { heavy: 3, prog: 1, extremo: 1 } },
      { texto: "Morte, frio e escuridão", pontos: { extremo: 2, postpunk: 2, doom: 1 } },
    ],
  },
  {
    pergunta: "Seu lugar no show:",
    opcoes: [
      { texto: "Grudado na grade", pontos: { emo: 2, heavy: 2 } },
      { texto: "No meio da roda", pontos: { thrash: 2, punk: 2, numetal: 1 } },
      { texto: "No fundo, de olho fechado", pontos: { shoegaze: 2, doom: 2, prog: 1 } },
      { texto: "Perto da mesa de som", pontos: { prog: 2, alternativo: 2 } },
    ],
  },
  {
    pergunta: "Qual animal seria seu mascote?",
    opcoes: [
      { texto: "Corvo", pontos: { postpunk: 3, extremo: 1 } },
      { texto: "Lobo", pontos: { extremo: 2, heavy: 2 } },
      { texto: "Barata (sobrevive a tudo)", pontos: { punk: 3, grunge: 1 } },
      { texto: "Polvo (oito braços, oito compassos)", pontos: { prog: 3, alternativo: 1 } },
    ],
  },
  {
    pergunta: "Que tipo de guitarra soa como você?",
    opcoes: [
      { texto: "Limpa, com chorus e eco", pontos: { postpunk: 3, alternativo: 1 } },
      { texto: "Afinada lá embaixo, sete cordas", pontos: { numetal: 3, doom: 1 } },
      { texto: "Tremolo gelado e rápido", pontos: { extremo: 3, shoegaze: 1 } },
      { texto: "Distorção suja de amplificador velho", pontos: { grunge: 3, punk: 1, doom: 1 } },
    ],
  },
  {
    pergunta: "Escolhe um rolê de domingo:",
    opcoes: [
      { texto: "Sebo de vinil caçando raridade", pontos: { classico: 2, prog: 2, alternativo: 1 } },
      { texto: "Skate na praça", pontos: { punk: 3, numetal: 1 } },
      { texto: "Cemitério antigo tirando foto", pontos: { postpunk: 3, extremo: 1 } },
      { texto: "Dormir até as 4 da tarde", pontos: { doom: 2, grunge: 2, shoegaze: 1 } },
    ],
  },
  {
    pergunta: "O que é ser rock pra você?",
    opcoes: [
      { texto: "Atitude, não importa o som", pontos: { punk: 3, grunge: 1 } },
      { texto: "Técnica e respeito pela música", pontos: { prog: 3, thrash: 1, heavy: 1 } },
      { texto: "Sentir junto, em comunidade", pontos: { emo: 2, numetal: 2, heavy: 1 } },
      { texto: "Ir contra tudo que é fácil", pontos: { extremo: 2, alternativo: 2, shoegaze: 1 } },
    ],
  },
  {
    pergunta: "Pior pesadelo musical:",
    opcoes: [
      { texto: "Uma balada romântica sem distorção", pontos: { extremo: 2, thrash: 2 } },
      { texto: "Música feita só pra viralizar", pontos: { alternativo: 2, punk: 2 } },
      { texto: "Um show sem nenhum solo", pontos: { heavy: 2, classico: 2 } },
      { texto: "Uma música que acaba em 2 minutos", pontos: { prog: 2, doom: 2, shoegaze: 1 } },
    ],
  },
  {
    pergunta: "Última pergunta: como você quer ser lembrado?",
    opcoes: [
      { texto: "Como lenda que mudou tudo", pontos: { classico: 2, heavy: 2, grunge: 1 } },
      { texto: "Como culto: poucos sabem, todos respeitam", pontos: { shoegaze: 2, doom: 2, extremo: 1 } },
      { texto: "Como quem gritou o que todo mundo sentia", pontos: { emo: 2, numetal: 2, punk: 1 } },
      { texto: "Como gênio incompreendido", pontos: { prog: 2, postpunk: 2, alternativo: 1 } },
    ],
  },
];
