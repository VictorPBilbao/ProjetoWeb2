import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private solicitacoes: Employee[] = [
  { 
    id: 1, 
    data: '2025-04-20', 
    hora: '14:00', 
    equipamento: 'Samsung Book4 360 Intel Core', 
    estado: 'ABERTA',
    servico: 'Manutenção', 
    orcamento: '', 
    funcionario: 'José Silva', 
    historico: 'Solicitação criada', 
    acao: 'Efetuar Orçamento',
    cor: 'cinza',
    categoria: 'Notebook',
    marca: 'Dell',
    descricaoServico: 'Verificar funcionamento geral do notebook.',
    defeitoRelatado: 'Desligamento inesperado.'
  },
  { 
    id: 2, 
    data: '2025-04-19', 
    hora: '10:30', 
    equipamento: 'Galaxy S23', 
    estado: 'ORÇADA',
    servico: 'Atualização', 
    orcamento: 'R$ 200,00', 
    funcionario: 'Ana Costa', 
    historico: 'Aguardando aprovação', 
    acao: 'Efetuar Orçamento',
    cor: 'marrom',
    categoria: 'Smartphone',
    marca: 'Samsung',
    descricaoServico: 'Atualização de hardware e sistema.',
    defeitoRelatado: 'Lento ao inicializar.'
  },
  {
    id: 3,
    data: '2025-04-18',
    hora: '16:15',
    equipamento: 'Galaxy Tab 8',
    estado: 'REJEITADA',
    servico: 'Limpeza',
    orcamento: 'R$ 50,00',
    funcionario: 'Lucas Almeida',
    historico: 'Rejeitada pelo cliente',
    acao: '',
    cor: 'vermelho',
    categoria: 'Tablet',
    marca: 'Samsung',
    descricaoServico: 'Limpeza interna e externa.',
    defeitoRelatado: 'Tela engordurada e lenta.'
  },
  {
    id: 4,
    data: '2025-04-17',
    hora: '09:00',
    equipamento: 'Iphone 16',
    estado: 'APROVADA',
    servico: 'Formatação',
    orcamento: 'R$ 300,00',
    funcionario: 'Maria Souza',
    historico: 'Orçamento aprovado',
    acao: 'Efetuar Manutenção',
    cor: 'amarelo',
    categoria: 'Smartphone',
    marca: 'Apple',
    descricaoServico: 'Formatação completa com backup.',
    defeitoRelatado: 'Sistema travando.'
  },
  {
    id: 5,
    data: '2025-04-16',
    hora: '11:45',
    equipamento: 'Acer Aspire 3',
    estado: 'REDIRECIONADA',
    servico: 'Configuração',
    orcamento: 'R$ 150,00',
    funcionario: 'José Silva',
    historico: 'Solicitação redirecionada',
    destinoFuncionario: 'Carlos Pereira',
    acao: 'Efetuar Manutenção',
    cor: 'roxo',
    categoria: 'Notebook',
    marca: 'Acer',
    descricaoServico: 'Configuração inicial de sistema e rede.',
    defeitoRelatado: 'Sem conexão com Wi-Fi.'
  },
  {
    id: 6,
    data: '2025-04-15',
    hora: '13:30',
    equipamento: 'Tab Le Novo',
    estado: 'ARRUMADA',
    servico: 'Limpeza',
    orcamento: '',
    funcionario: 'Ana Costa',
    historico: 'Manutenção concluída',
    acao: '',
    cor: 'azul',
    categoria: 'Tablet',
    marca: 'Le Novo',
    descricaoServico: 'Limpeza técnica.',
    defeitoRelatado: 'Som abafado.'
  },
  {
    id: 7,
    data: '2025-04-14',
    hora: '15:20',
    equipamento: 'Computador',
    estado: 'PAGA',
    servico: 'Troca de peças',
    orcamento: 'R$ 800,00',
    funcionario: 'Lucas Almeida',
    historico: 'Pagamento efetuado',
    acao: 'Finalizar Solicitação',
    cor: 'alaranjado',
    categoria: 'Desktop',
    marca: 'Dell',
    descricaoServico: 'Substituição de fonte e memória.',
    defeitoRelatado: 'Não liga.'
  },
  {
    id: 8,
    data: '2025-04-13',
    hora: '12:00',
    equipamento: 'Dell Inspiron I15',
    estado: 'FINALIZADA',
    servico: 'Configuração',
    orcamento: 'R$ 250,00',
    funcionario: 'José Silva',
    historico: 'Solicitação finalizada',
    acao: '',
    cor: 'verde',
    categoria: 'Notebook',
    marca: 'Dell',
    descricaoServico: 'Configuração de contas e apps.',
    defeitoRelatado: 'Dificuldade para configurar e-mail.'
  }
];

  private solicitacoesSubject = new BehaviorSubject<Employee[]>(this.solicitacoes);

  solicitacoes$ = this.solicitacoesSubject.asObservable();

  constructor() {}

  listar() {
    return this.solicitacoes$;
  }

  adicionar(solicitacao: Employee) {
    solicitacao.id = Date.now();  // Gera um ID único
    this.solicitacoes.push(solicitacao);
    this.solicitacoesSubject.next(this.solicitacoes); // Atualiza o BehaviorSubject
  }

  editar(solicitacao: Employee) {
    const index = this.solicitacoes.findIndex(s => s.id === solicitacao.id);
    if (index !== -1) {
      this.solicitacoes[index] = solicitacao;
      this.solicitacoesSubject.next(this.solicitacoes); // Atualiza o BehaviorSubject
    }
  }

  remover(id: number) {
    this.solicitacoes = this.solicitacoes.filter(s => s.id !== id);
    this.solicitacoesSubject.next(this.solicitacoes); // Atualiza o BehaviorSubject
  }

  buscarPorId(id: number): Employee | undefined {
    return this.solicitacoes.find(s => s.id === id);
  }
}
