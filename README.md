# Alunos:

<div align="center">

| Nome                     | GRR         |
| ------------------------ | ----------- |
| Adriano Zandroski Soares | GRR20231029 |
| Iman de Lacerda          | GRR20193747 |
| Patrick Correia Camilo   | GRR20231008 |
| Thalita dos Santos       | GRR20231007 |
| Victor Pasini Bilbao     | GRR20231012 |


</div>

# WORKFLOW (Desenvolvimento):

Temos 2 branches:

• Main 
• Dev 

O branch main é o principal, onde o código está sempre funcionando em ambiente de produção. 

O branch dev é o branch de desenvolvimento, onde podemos adicionar novas funcionalidades e testar, em que contará inclusive com testes automatizados em Gherkin e contando com Pipeline CI/CD. 

Todos os deploys serão feitos da seguinte maneira: 

1 - Criar uma nova branch, a partir da branch "Dev". Desenvolver, realizar a sincronização com o github e depois solicitar um pull request para o branch dev. 

2 - Após a validação da alteração, poderá realizar o merge com a branch "Dev", sendo somente após isso o pull request para a "Main", que simula o ambiente de produção. Para isso, haverá uma pessoa responsável por fazer o code review. Possivelmente, Victor ou Adriano.

# Diagrama de caso de uso: 

Para facilitar o desenvolvimento, abaixo, o diagrama de caso de uso do cliente: 

<img src="\image\diagrama.png">