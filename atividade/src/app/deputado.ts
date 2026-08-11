export type Deputado = {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email: string;
  dataInicio?: string;
  dataFim?: string;
};

export type DeputadosResponse = {
  dados: Deputado[];
};

export type Legislatura = {
  id: number;
  uri: string;
  dataInicio: string;
  dataFim: string;
};

export type LegislaturasResponse = {
  dados: Legislatura[];
};

export type Lider = {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  urlFoto: string;
  email: string;
  titulo: string;
  dataInicio: string;
  dataFim: string | null;
};

export type LideresResponse = {
  dados: Lider[];
};
