import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [provideNgxMask()],  
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  isModalVisible: boolean = false;
  isLoading = false;

  tiposServico = ['Atualização', 'Formatação', 'Configuração', 'Limpeza', 'Manutenção', 'Troca de peças'];
  opcoesParcelas = [1, 2, 3, 4, 5, 6, 10, 12];
  task = ['001', '005', '007', '009', '011', '013', '017', '018'];

  codigoBarras = '1234 5678 9012 3456 7890 1234 5678';
  chavePix = 'byte-assist@pix.com.br';
  qrCodeUrl: string = '';

  pagamento = {
    tipoServico: '',
    dataServico: '',
    task:'',
    empresa: 'Byte Assist',
    cnpj: '46.485.166/0001-46',
    valor: '',
    tipoPagamento: '',
    numeroCartao: '',
    vencimentoCartao: '',
    nomeTitular: '',
    parcelas: 1
  };

  // Método que será chamado ao submeter o formulário
  submitForm() {
    this.isLoading = true; // Ativa o estado de loading
    console.log('Dados do pagamento:', this.pagamento);

    // Simula o tempo de processamento do pagamento
    setTimeout(() => {
      this.isLoading = false;  // Desativa o estado de loading
      this.isModalVisible = true;  // Exibe o modal de confirmação
    }, 3000); // Simula 3 segundos de processamento (você pode ajustar esse tempo conforme necessário)
  }

  // Método para fechar o modal
  fecharModal() {
    this.isModalVisible = false;
    window.location.reload(); // Refresca a página após o fechamento do modal
  }

  // Lógica de mudança de tipo de pagamento
  onTipoPagamentoChange() {
    if (this.pagamento.tipoPagamento === 'BOLETO') {
      this.codigoBarras = this.gerarCodigoBarras();
    } else if (this.pagamento.tipoPagamento === 'PIX') {
      this.chavePix = this.gerarChavePix();
      this.qrCodeUrl = ''; // Limpa o QR anterior, se houver troca
    }
  }

  // Método para copiar a chave Pix para a área de transferência
  copiarChavePix() {
    navigator.clipboard.writeText(this.chavePix)
      .then(() => {
        alert('Chave Pix copiada com sucesso!');
      })
      .catch(err => {
        console.error('Erro ao copiar a chave Pix:', err);
      });
  }

  // Método para gerar o QR Code
  gerarQrCode() {
    const pixData = this.chavePix;
    this.qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(pixData)}`;
  }

  // Método para gerar código de barras
  private gerarCodigoBarras(): string {
    return '34191.79001 01043.510047 91020.150008 6 85410000002000';
  }

  // Método para gerar chave Pix
  private gerarChavePix(): string {
    return `${Math.random().toString(36).substring(2, 15)}@byte-assist.com.br`;
  }

  // Método de inicialização que será chamado quando o componente for carregado
  ngOnInit(): void {
    // Garante que o código de barras e a chave Pix sejam gerados na inicialização
    this.codigoBarras = this.gerarCodigoBarras();
    this.chavePix = this.gerarChavePix();
  }
}
