export interface Employee {
  id: number;
  data: string;                // ex: '2025-04-20'
  hora: string;                // ex: '14:30'
  equipamento: string;         // ex: 'Impressora HP 1234'
  estado: string;              // ex: 'ABERTA', 'APROVADA', etc.          // pode ser opcional
  funcionario?: string;        // nome do responsável pela solicitação
  historico?: string;          // breve histórico
  destinoFuncionario?: string;
  acao?: string; // Propriedade opcional 
  cor?: string; 
  categoria?: string;
  marca?: string;
  servico?: string;
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
