export interface Employee {
  id: string;
  data: string;
  hora: string;
  equipamento: string;
  estado: string;
  funcionario?: string;
  historico?: string;
  destinoFuncionario?: string;
  acao?: string;
  cor?: string;
  categoria?: string;
  marca?: string;
  autor?: string;
  //servico?: string; //nao existe no back
  descricaoServico?: string;
  defeitoRelatado?: string;
  orcamento: string;
  dataAbertura?: string;
  nome?: string;
  descricaoManutencao?: string;
  orientacoesCliente?: string;
  dataHoraManutencao?: Date;
  funcionarioDestino?: string;
}

