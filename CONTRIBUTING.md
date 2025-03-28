# Contribuindo para o ByteAssist

Obrigado por considerar contribuir para o ByteAssist! Este documento descreve o fluxo de trabalho e as diretrizes para ajudar você a contribuir de forma eficaz.

---

## Estratégia de Branches

Utilizamos as seguintes branches para o desenvolvimento:

- **Main**: A branch de produção. O código aqui é estável e está em produção.
- **Dev**: A branch de desenvolvimento. Novas funcionalidades e correções são integradas aqui antes de serem mescladas na `Main`.

---

## Fluxo de Trabalho para Contribuir

### 1. Faça um Fork do Repositório
Comece fazendo um fork do repositório para sua conta no GitHub.

### 2. Clone o Repositório
Clone o repositório forkado para sua máquina local:
```bash
git clone https://github.com/seu-usuario/ProjetoWeb2.git
cd ProjetoWeb2
```

### 3. Crie uma Nova Branch
Crie uma nova branch a partir da `Dev` para sua funcionalidade ou correção:
```bash
git checkout dev
git pull origin dev
git checkout -b feature/nome-da-sua-funcionalidade
```

### 4. Faça Suas Alterações
- Siga os padrões de codificação do projeto.
- Escreva mensagens de commit claras e concisas.
- Certifique-se de que seu código esteja bem documentado e testado.

### 5. Teste Suas Alterações
Execute os testes para garantir que suas alterações não quebrem funcionalidades existentes:
- **Backend**: Use os comandos Maven fornecidos.
- **Frontend**: Use `ng test` para executar os testes do Angular.

### 6. Faça o Commit e Envie
Faça o commit das suas alterações e envie para o seu fork:
```bash
git add .
git commit -m "Adicione uma breve descrição das suas alterações"
git push origin feature/nome-da-sua-funcionalidade
```

### 7. Crie um Pull Request
Acesse o repositório original e crie um pull request (PR) da sua branch para a branch `Dev`. Inclua:
- Um título claro e uma descrição das suas alterações.
- Capturas de tela ou referências relevantes, se necessário.

---

## Revisão de Código e Mesclagem

1. Seu PR será revisado por um membro da equipe (@VictorPBilbao ou @AdrianoZS) caso esteja mergeando na branch `main` caso contrário, você mesmo pode revisar!
2. Faça as alterações solicitadas, se necessário.
3. Após a aprovação, seu PR será mesclado na branch `Dev`.
4. Após testes adicionais, as alterações na `Dev` serão mescladas na `Main`.

---

## Notas Adicionais

- **Testes**: Certifique-se de que todos os testes passem antes de enviar seu PR. Além disso, adicione testes unitários para novas funcionalidades!!
- **Pipeline CI/CD**: Testes automatizados serão executados para garantir a estabilidade.
- **Documentação**: Atualize a documentação relevante se suas alterações afetarem a funcionalidade.

Obrigado por contribuir para o ByteAssist! 🚀
