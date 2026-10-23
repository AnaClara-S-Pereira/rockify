import { normalize } from "../lib/utils";
import type { BandDossier, MemberDossier } from "../types";

// LIVRO NEGRO
export const DOSSIES: BandDossier[] = [
  {
    banda: "Nirvana",
    manchete: "Três caras de Aberdeen que fizeram o mundo inteiro usar flanela.",
    segredos: [
      "Antes de virar Nirvana, a banda já se chamou Skid Row, Pen Cap Chew, Bliss e Ted Ed Fred.",
      "O título \"Smells Like Teen Spirit\" veio de uma pichação de Kathleen Hanna (Bikini Kill): \"Teen Spirit\" era a marca do desodorante que a namorada de Kurt usava. Ele não sabia.",
      "Dave Grohl foi o sexto baterista da banda. Os cinco anteriores raramente são lembrados.",
    ],
    integrantes: [
      {
        nome: "Kurt Cobain",
        apelido: "O Garoto da Ponte",
        infancia: [
          "Nasceu em Aberdeen, Washington, cidade madeireira e chuvosa.",
          "Os pais se separaram quando ele tinha 9 anos — ele dizia que tudo mudou ali.",
          "No aniversário de 14 anos, o tio deu a escolha: uma bicicleta ou uma guitarra. Ele escolheu a guitarra.",
          "Desenhava o tempo todo; a pintura da capa de \"Incesticide\" é dele.",
        ],
        curiosidades: [
          "Era canhoto e tocava guitarras canhotas, quase sempre baratas.",
          "Trabalhou como zelador na escola onde estudou antes da fama.",
          "Vivia indicando bandas pequenas em entrevistas — Vaselines, Meat Puppets e Raincoats ganharam fãs por causa dele.",
        ],
        polemicas: [
          "Em 1992 a Vanity Fair publicou que Courtney Love usou heroína na gravidez, o que levou a uma batalha com o serviço social pela guarda da filha Frances Bean.",
          "Em março de 1994 sofreu uma overdose em Roma, misturando champanhe e calmantes, e ficou em coma.",
        ],
      },
      {
        nome: "Dave Grohl",
        apelido: "O Baterista Mais Simpático do Mundo",
        infancia: [
          "Nasceu em Warren, Ohio, e cresceu em Springfield, na Virgínia.",
          "Os pais se separaram quando ele tinha 7 anos; foi criado pela mãe, professora.",
          "Sem bateria em casa, aprendeu a tocar batendo em travesseiros no quarto.",
        ],
        curiosidades: [
          "Aos 17 mentiu que tinha 20 pra entrar na banda de hardcore Scream.",
          "Gravou sozinho todos os instrumentos do primeiro disco do Foo Fighters.",
          "Quebrou a perna num show em 2015, voltou ao palco engessado e terminou o show sentado.",
        ],
        polemicas: [
          "Em 2024 anunciou publicamente que teve uma filha fora do casamento.",
        ],
      },
      {
        nome: "Krist Novoselic",
        apelido: "O Gigante do Baixo",
        infancia: [
          "Filho de imigrantes croatas, nasceu em Compton, na Califórnia.",
          "Adolescente, morou um ano na Croácia (então Iugoslávia) com a mãe.",
        ],
        curiosidades: [
          "Tem cerca de 2,01 m de altura.",
          "No VMA de 1992 jogou o baixo pro alto e ele caiu na cabeça dele, ao vivo.",
          "Virou ativista de reforma eleitoral e fundou um partido político em Washington.",
        ],
        polemicas: [
          "Em 2020 um post elogiando um discurso de Donald Trump gerou uma onda de críticas de fãs; ele fechou as redes depois.",
        ],
      },
    ],
  },
  {
    banda: "Metallica",
    manchete: "De um anúncio de jornal à maior banda de metal do planeta.",
    segredos: [
      "Lars Ulrich achou James Hetfield por um anúncio no jornal de classificados The Recycler, em 1981.",
      "O nome veio de uma lista de nomes que o amigo Ron Quintana fazia para uma revista. Lars gostou de \"Metallica\" e sugeriu outro nome pra revista.",
      "\"St. Anger\" (2003) não tem nenhum solo de guitarra — até hoje divide fãs.",
    ],
    integrantes: [
      {
        nome: "James Hetfield",
        apelido: "O Riff em Pessoa",
        infancia: [
          "Nasceu em Downey, Califórnia, filho de pais da Ciência Cristã, que rejeita tratamentos médicos.",
          "O pai foi embora quando ele tinha 13 anos.",
          "A mãe morreu de câncer quando ele tinha 16, sem aceitar tratamento — tema que aparece em várias letras.",
        ],
        curiosidades: [
          "É apaixonado por carros customizados; parte da coleção já foi exposta no Petersen Automotive Museum.",
          "Em 1992, em Montreal, foi atingido por um efeito pirotécnico no palco e sofreu queimaduras sérias no braço.",
        ],
        polemicas: [
          "A ida para a reabilitação em 2001 quase acabou com a banda, e a crise foi filmada no documentário \"Some Kind of Monster\".",
          "Em 2019 a banda cancelou uma turnê para ele voltar ao tratamento.",
        ],
      },
      {
        nome: "Lars Ulrich",
        apelido: "O Dinamarquês do Contrato",
        infancia: [
          "Nasceu em Gentofte, Dinamarca. O pai, Torben Ulrich, era tenista profissional.",
          "Foi pros EUA adolescente com a ideia de virar tenista também.",
          "Ver um show do Deep Purple em Copenhague ainda criança mudou o plano.",
        ],
        curiosidades: [
          "Foi ele quem colocou o anúncio de jornal que deu início ao Metallica.",
        ],
        polemicas: [
          "Em 2000 liderou o processo do Metallica contra o Napster e virou o vilão número 1 da internet.",
        ],
      },
      {
        nome: "Kirk Hammett",
        apelido: "O Colecionador de Monstros",
        infancia: [
          "Nasceu em São Francisco e cresceu colecionando revistas e bonecos de filmes de terror.",
        ],
        curiosidades: [
          "Foi um dos fundadores do Exodus antes de entrar no Metallica.",
          "Sua coleção de terror virou a exposição \"It's Alive!\" num museu de Massachusetts.",
          "Perdeu um celular num aeroporto com cerca de 250 riffs gravados que nunca recuperou.",
        ],
        polemicas: [
          "Foi o guitarrista solo de \"St. Anger\", o disco sem solos — e levou boa parte das críticas.",
        ],
      },
      {
        nome: "Robert Trujillo",
        apelido: "O Caranguejo do Baixo",
        infancia: [
          "Nasceu em Santa Monica, Califórnia, e cresceu na cena de skate e punk de Venice.",
        ],
        curiosidades: [
          "Tocou no Suicidal Tendencies e na banda de Ozzy Osbourne antes de entrar no Metallica.",
          "Produziu \"Jaco\", documentário sobre o baixista Jaco Pastorius.",
        ],
        polemicas: [
          "Recebeu um adiantamento de 1 milhão de dólares para entrar na banda, cena mostrada em \"Some Kind of Monster\".",
        ],
      },
      {
        nome: "Cliff Burton",
        apelido: "O Gênio da Calça Boca de Sino",
        infancia: [
          "Cresceu em Castro Valley, Califórnia.",
          "Começou a tocar baixo aos 13, logo depois da morte do irmão mais velho.",
        ],
        curiosidades: [
          "Tinha formação em teoria musical e adorava música clássica e Misfits ao mesmo tempo.",
          "Segundo Kirk, os dois tiraram a sorte nas cartas pra escolher a cama do ônibus na noite do acidente. Cliff tirou o ás de espadas.",
          "Morreu em setembro de 1986, aos 24 anos, num acidente com o ônibus da turnê na Suécia.",
        ],
        polemicas: [],
      },
      {
        nome: "Jason Newsted",
        apelido: "O Novato Eterno",
        infancia: [
          "Cresceu numa fazenda com cavalos em Michigan.",
        ],
        curiosidades: [
          "Tocava no Flotsam and Jetsam antes de substituir Cliff Burton.",
        ],
        polemicas: [
          "Sofreu anos de trotes da banda por ser \"o novato\".",
          "O baixo dele em \"...And Justice for All\" ficou quase inaudível na mixagem — até hoje é meme.",
        ],
      },
      {
        nome: "Dave Mustaine",
        apelido: "O Demitido Mais Famoso",
        infancia: [
          "Nasceu em La Mesa, Califórnia, e teve uma infância instável, mudando de casa com frequência.",
        ],
        curiosidades: [
          "Depois de sair do Metallica, fundou o Megadeth.",
        ],
        polemicas: [
          "Foi expulso do Metallica em 1983 por causa de bebida e brigas.",
          "Por décadas afirmou ter criado partes de músicas que ficaram creditadas a outros membros.",
        ],
      },
    ],
  },
  {
    banda: "Black Sabbath",
    manchete: "Quatro operários de Birmingham que inventaram o heavy metal.",
    segredos: [
      "Antes de Black Sabbath, a banda se chamava Earth. O novo nome veio de um filme de terror de 1963 com Boris Karloff.",
      "O som pesado e afinado mais grave nasceu de um acidente: os dedos machucados de Tony Iommi.",
      "O último show da formação original foi em Birmingham, em julho de 2025.",
    ],
    integrantes: [
      {
        nome: "Ozzy Osbourne",
        aliases: ["John Michael Osbourne"],
        apelido: "O Príncipe das Trevas",
        infancia: [
          "Nasceu em Aston, Birmingham, numa família operária e pobre.",
          "Tinha dislexia e sofria bullying na escola.",
          "Trabalhou num abatedouro e chegou a passar semanas preso por um furto quando era jovem.",
        ],
        curiosidades: [
          "Foi demitido do próprio Black Sabbath em 1979 e virou um astro ainda maior em carreira solo.",
          "Morreu em julho de 2025, poucas semanas depois do show de despedida em Birmingham.",
        ],
        polemicas: [
          "Em 1982 mordeu a cabeça de um morcego jogado no palco — ele jura que achou que era de borracha.",
          "Em 1981 arrancou com os dentes a cabeça de uma pomba numa reunião com executivos da gravadora.",
          "Em 1982 foi preso por urinar num monumento do Álamo, no Texas, e ficou banido de San Antonio por anos.",
          "Em 1989, bêbado, foi preso e acusado de tentar estrangular Sharon Osbourne, que depois retirou a queixa.",
        ],
      },
      {
        nome: "Tony Iommi",
        apelido: "O Homem dos Dedos de Plástico",
        infancia: [
          "Cresceu em Birmingham e queria ser baterista, mas a bateria fazia barulho demais em casa.",
          "Aos 17, no último dia de trabalho numa fábrica, uma prensa decepou as pontas de dois dedos da mão direita.",
        ],
        curiosidades: [
          "Inspirado pelo guitarrista Django Reinhardt, que tocava com dois dedos, não desistiu.",
          "Fez dedais com plástico derretido de um frasco de detergente e passou a afinar a guitarra mais grave — nascia o som do metal.",
        ],
        polemicas: [
          "Admitiu que, numa brincadeira de estúdio, colocou fogo no baterista Bill Ward, que se queimou de verdade.",
        ],
      },
      {
        nome: "Geezer Butler",
        aliases: ["Terence Michael Joseph Butler"],
        apelido: "O Poeta Sombrio",
        infancia: [
          "Cresceu em Birmingham numa família católica de origem irlandesa.",
          "O apelido \"Geezer\" veio da mania de chamar todo mundo de \"geezer\" (\"cara\").",
        ],
        curiosidades: [
          "Escreveu a maior parte das letras do Black Sabbath, com temas de guerra, ocultismo e religião.",
        ],
        polemicas: [
          "Em 2016 foi preso após uma briga num bar na Flórida.",
        ],
      },
      {
        nome: "Bill Ward",
        apelido: "O Baterista Incendiado",
        infancia: [
          "Cresceu em Birmingham ouvindo bateristas de big band de jazz.",
        ],
        curiosidades: [
          "Foi o baterista de todos os discos clássicos da formação original.",
        ],
        polemicas: [
          "Em 2012 ficou fora da reunião da banda por causa de um contrato que chamou de \"impossível de assinar\".",
        ],
      },
    ],
  },
  {
    banda: "Ramones",
    manchete: "Quatro \"irmãos\" de Queens que não eram irmãos e inventaram o punk em 2 minutos.",
    segredos: [
      "Nenhum deles era parente. O sobrenome \"Ramone\" veio de Paul McCartney, que usava o pseudônimo Paul Ramon em hotéis.",
      "Tocavam tão rápido que shows inteiros duravam pouco mais de meia hora.",
    ],
    integrantes: [
      {
        nome: "Joey Ramone",
        aliases: ["Jeffrey Hyman"],
        apelido: "O Gigante Gentil",
        infancia: [
          "Nasceu Jeffrey Hyman em Forest Hills, Queens.",
          "Tinha transtorno obsessivo-compulsivo, o que tornava a vida em turnê bem difícil.",
        ],
        curiosidades: [
          "Começou na banda como baterista antes de virar vocalista.",
          "Morreu em 2001, vítima de um linfoma.",
        ],
        polemicas: [
          "Brigou feio com Johnny quando ele começou a namorar (e depois se casou com) Linda, ex-namorada de Joey. Os dois quase não se falavam fora do palco.",
        ],
      },
      {
        nome: "Johnny Ramone",
        aliases: ["John Cummings"],
        apelido: "O Sargento",
        infancia: [
          "Nasceu John Cummings e cresceu em Queens.",
        ],
        curiosidades: [
          "Comandava a banda com disciplina militar: horários, dinheiro e regras.",
          "Tocava quase só com palhetadas para baixo, o que definiu o som da banda.",
        ],
        polemicas: [
          "Era assumidamente conservador e, na entrada da banda no Rock and Roll Hall of Fame em 2002, encerrou o discurso saudando o presidente George W. Bush — num ambiente punk.",
        ],
      },
      {
        nome: "Dee Dee Ramone",
        aliases: ["Douglas Colvin"],
        apelido: "O Compositor Caótico",
        infancia: [
          "Nasceu em Fort Lee, Virgínia, filho de militar, e passou a infância na Alemanha do pós-guerra.",
          "Em suas memórias contou que, criança, catava capacetes e objetos da guerra nos escombros.",
        ],
        curiosidades: [
          "Escreveu muitas das músicas mais famosas dos Ramones.",
          "Em 1989 lançou um disco de rap como Dee Dee King.",
        ],
        polemicas: [
          "Lutou contra o vício em heroína a vida toda e saiu da banda em 1989. Morreu de overdose em 2002.",
        ],
      },
      {
        nome: "Tommy Ramone",
        aliases: ["Thomas Erdelyi", "Tamás Erdélyi"],
        apelido: "O Cérebro Silencioso",
        infancia: [
          "Nasceu em Budapeste, na Hungria, e a família emigrou para Nova York quando ele era criança.",
        ],
        curiosidades: [
          "Trabalhou como assistente de engenharia de som antes da banda, inclusive em gravações de Jimi Hendrix.",
          "Saiu da bateria em 1978, cansado das turnês, e virou produtor da banda.",
          "Foi o último integrante original a morrer, em 2014.",
        ],
        polemicas: [],
      },
    ],
  },
  {
    banda: "The Cure",
    manchete: "O cabelo mais bagunçado e a tristeza mais dançante do pós-punk.",
    segredos: [
      "Antes de The Cure, a banda se chamou Malice e depois Easy Cure.",
      "Robert Smith e Lol Tolhurst se conheciam desde os 5 anos de idade.",
    ],
    integrantes: [
      {
        nome: "Robert Smith",
        apelido: "O Batom Borrado",
        infancia: [
          "Nasceu em Blackpool e cresceu em Crawley, no sul da Inglaterra.",
          "Montou a primeira banda com colegas de escola ainda adolescente.",
        ],
        curiosidades: [
          "Foi também guitarrista do Siouxsie and the Banshees em duas fases.",
          "Em 2023 enfrentou a Ticketmaster por causa das taxas abusivas e conseguiu reembolso parcial para os fãs.",
        ],
        polemicas: [
          "\"Killing an Arab\" (1978), inspirada no livro \"O Estrangeiro\", de Camus, foi mal interpretada por anos; a banda chegou a pedir para rádios não tocarem a música.",
        ],
      },
      {
        nome: "Simon Gallup",
        apelido: "O Baixo Pendurado no Joelho",
        infancia: [
          "Cresceu em Surrey e tocava numa banda punk chamada Lockjaw.",
        ],
        curiosidades: [
          "O baixo dele é a base de clássicos como \"A Forest\".",
        ],
        polemicas: [
          "Em 1982 saiu da banda depois de uma briga de socos com Robert Smith. Voltou em 1985.",
        ],
      },
      {
        nome: "Lol Tolhurst",
        aliases: ["Laurence Tolhurst"],
        apelido: "O Amigo de Infância",
        infancia: [
          "Conheceu Robert Smith aos 5 anos, no ônibus da escola.",
        ],
        curiosidades: [
          "Começou como baterista e depois passou para os teclados.",
        ],
        polemicas: [
          "Foi demitido em 1989 por causa do alcoolismo e processou a banda pelo nome e por royalties em 1994 — e perdeu.",
          "Anos depois fez as pazes e voltou a tocar com o Cure em 2011.",
        ],
      },
    ],
  },
  {
    banda: "Sepultura",
    manchete: "De Belo Horizonte pro mundo: a banda brasileira que botou o metal no mapa.",
    segredos: [
      "O nome veio da tradução de \"Dancing on Your Grave\", do Motörhead.",
      "Para o disco \"Roots\" (1996), a banda gravou com o povo indígena Xavante, em Mato Grosso.",
      "Em 2023 anunciou o fim, com uma turnê de despedida mundial.",
    ],
    integrantes: [
      {
        nome: "Max Cavalera",
        apelido: "O Fundador",
        infancia: [
          "Nasceu em Belo Horizonte. O pai, italiano, trabalhava no consulado da Itália.",
          "O pai morreu quando Max tinha uns 9 anos, e a família passou por dificuldades.",
        ],
        curiosidades: [
          "Fundou o Soulfly depois de sair do Sepultura e depois o Cavalera Conspiracy com o irmão Igor.",
          "Em 2023 regravou com Igor os primeiros discos do Sepultura.",
        ],
        polemicas: [
          "Saiu do Sepultura em 1996 depois que a banda dispensou a empresária Gloria, esposa dele. A briga durou décadas e a reunião nunca aconteceu.",
        ],
      },
      {
        nome: "Igor Cavalera",
        aliases: ["Iggor Cavalera"],
        apelido: "O Tambor Tribal",
        infancia: [
          "Irmão mais novo de Max, cresceu em Belo Horizonte e montou a banda com ele ainda adolescente.",
        ],
        curiosidades: [
          "Os ritmos tribais da bateria em \"Roots\" viraram marca registrada.",
          "Tem um projeto de música eletrônica, o Mixhell.",
          "Por um tempo assinou o nome como \"Iggor\".",
        ],
        polemicas: [
          "Deixou o Sepultura em 2006, encerrando a era dos irmãos Cavalera na banda.",
        ],
      },
      {
        nome: "Andreas Kisser",
        apelido: "O Guardião",
        infancia: [
          "Nasceu em São Bernardo do Campo, São Paulo.",
        ],
        curiosidades: [
          "Entrou na banda em 1987 e virou o líder musical depois da saída de Max.",
        ],
        polemicas: [],
      },
      {
        nome: "Derrick Green",
        apelido: "O Forasteiro",
        infancia: [
          "Nasceu em Cleveland, Ohio, nos EUA.",
        ],
        curiosidades: [
          "Entrou em 1998 e ficou mais tempo no vocal do Sepultura do que Max.",
        ],
        polemicas: [
          "Enfrentou anos de resistência de fãs que nunca aceitaram ninguém no lugar de Max.",
        ],
      },
    ],
  },
  {
    banda: "Iron Maiden",
    manchete: "Galopes no baixo, Eddie no palco e um vocalista que pilota o próprio avião.",
    segredos: [
      "O nome vem de um instrumento de tortura que Steve Harris viu num filme inspirado em \"O Homem da Máscara de Ferro\".",
      "O mascote Eddie foi criado pelo ilustrador Derek Riggs.",
      "O último show de Nicko McBrain com a banda foi em São Paulo, em dezembro de 2024.",
    ],
    integrantes: [
      {
        nome: "Bruce Dickinson",
        apelido: "A Sirene Antiaérea",
        infancia: [
          "Nasceu em Worksop, Inglaterra.",
          "Foi expulso do colégio interno depois de urinar no jantar do diretor.",
        ],
        curiosidades: [
          "É piloto comercial e já pilotou o avião da turnê da banda, o Ed Force One.",
          "Foi esgrimista de nível competitivo e escreve livros.",
          "Venceu um câncer na garganta e na língua em 2015.",
        ],
        polemicas: [
          "Saiu da banda em 1993 para seguir carreira solo e só voltou em 1999.",
        ],
      },
      {
        nome: "Steve Harris",
        apelido: "O Chefe",
        infancia: [
          "Nasceu em Leytonstone, Londres, e sonhava ser jogador de futebol — chegou a fazer testes no West Ham.",
        ],
        curiosidades: [
          "Fundou a banda em 1975 e é o principal compositor.",
          "O estilo \"galope\" no baixo virou assinatura do Maiden.",
        ],
        polemicas: [],
      },
      {
        nome: "Nicko McBrain",
        aliases: ["Michael Henry McBrain"],
        apelido: "O Ursinho",
        infancia: [
          "Nasceu Michael McBrain em Londres. O apelido Nicko veio do ursinho de pelúcia que ele tinha, chamado Nicholas.",
        ],
        curiosidades: [
          "Teve um AVC em 2023, voltou aos palcos e se despediu das turnês em São Paulo, em 2024.",
        ],
        polemicas: [],
      },
      {
        nome: "Paul Di'Anno",
        aliases: ["Paul Di Anno", "Paul Andrews"],
        apelido: "O Primeiro Grito",
        infancia: [
          "Cresceu no leste de Londres.",
        ],
        curiosidades: [
          "Cantou nos dois primeiros discos da banda. Morreu em 2024.",
        ],
        polemicas: [
          "Foi demitido em 1981 por problemas com álcool e drogas.",
          "Em 2011 foi preso no Reino Unido por fraude em benefícios do governo.",
        ],
      },
    ],
  },
  {
    banda: "Joy Division",
    manchete: "Quatro anos, dois discos e uma sombra que nunca saiu de Manchester.",
    segredos: [
      "Antes de Joy Division, a banda se chamava Warsaw.",
      "O nome foi tirado de um romance sobre a Segunda Guerra e gerou acusações de mau gosto desde o início.",
      "Depois da morte de Ian Curtis, os outros três viraram o New Order.",
    ],
    integrantes: [
      {
        nome: "Ian Curtis",
        apelido: "A Dança Quebrada",
        infancia: [
          "Nasceu em Stretford e cresceu em Macclesfield, perto de Manchester.",
          "Ganhou bolsa numa escola particular aos 11 anos e era obcecado por poesia e por David Bowie.",
        ],
        curiosidades: [
          "Antes da fama, trabalhava num órgão público ajudando pessoas com deficiência a conseguir emprego.",
          "Tinha epilepsia, e o jeito de dançar no palco lembrava as próprias crises.",
          "Morreu em maio de 1980, às vésperas da primeira turnê nos EUA.",
        ],
        polemicas: [
          "A esposa, Deborah Curtis, contou no livro \"Touching from a Distance\" o caso dele com a jornalista Annik Honoré.",
        ],
      },
      {
        nome: "Peter Hook",
        apelido: "O Baixo Agudo",
        infancia: [
          "Cresceu em Salford. Comprou o primeiro baixo depois de ver os Sex Pistols em Manchester, em 1976.",
        ],
        curiosidades: [
          "Tocava o baixo agudo como se fosse guitarra solo — virou o som da banda.",
        ],
        polemicas: [
          "Brigou na Justiça com os ex-colegas do New Order por anos, até um acordo em 2017.",
        ],
      },
      {
        nome: "Bernard Sumner",
        aliases: ["Bernard Dicken", "Bernard Albrecht"],
        apelido: "O Homem de Muitos Nomes",
        infancia: [
          "Cresceu em Salford e também estava no famoso show dos Sex Pistols em 1976.",
        ],
        curiosidades: [
          "Já usou os sobrenomes Dicken e Albrecht antes de ficar conhecido como Sumner.",
          "Virou vocalista do New Order depois da morte de Ian.",
        ],
        polemicas: [],
      },
      {
        nome: "Stephen Morris",
        apelido: "A Máquina Humana",
        infancia: [
          "Nasceu em Macclesfield, a mesma cidade de Ian Curtis.",
        ],
        curiosidades: [
          "A bateria precisa e quase robótica dele abriu caminho para o som eletrônico do New Order.",
        ],
        polemicas: [],
      },
    ],
  },
];

export function findBandDossier(name: string): BandDossier | undefined {
  const key = normalize(name);
  return DOSSIES.find((d) => normalize(d.banda) === key);
}

export function findMemberDossier(...names: (string | undefined)[]): MemberDossier | undefined {
  const keys = names.filter(Boolean).map((n) => normalize(n!));
  for (const band of DOSSIES) {
    for (const m of band.integrantes) {
      const own = [m.nome, ...(m.aliases ?? [])].map(normalize);
      if (own.some((k) => keys.includes(k))) return m;
    }
  }
  return undefined;
}
