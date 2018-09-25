# INSTRUÇÕES #

Neste teste prático você deverá implementar um formulário de cadastro que submete informações para um backend fornecido.
Após o cadastro ter sido realizado com sucesso, deve ser apresentado um dashboard desenvolvido por você para apresentar dois
gráficos cujos dados devem ser obtidas através da API fornecida. Você também implementará uma visão tabulada dos dados exibidos nos gráficos.

Para realizar o teste, siga as orientações abaixo. Sua prova deverá ser executada com Node 10 e a última versão do `npm` através dos comandos:

`npm install`
`npm run serve` ou `npm start`

1. Crie um cadastro responsivo usando Angular contendo os seguintes campos:

    * Email * (email)
    * Senha * (password)
    * Repita a senha * (passwordConfirmation)
    * Nome Completo * (fullName)
    * Data de Nascimento * (birthDate)
    * CEP * (zipCode)
    * Rua * (streetName)
    * Número * (number)
    * Complemento (complement)
    * Bairro (neighbourhood)
    * País * (country)
    * Estado * (state)
    * Cidade * (city)

    Proponha o layout que desejar e as melhores práticas de UX que quiser. Os nomes em parênteses se referem ao id dos elementos no HTML (sua prova será corrigida primeiro por uma bateria de testes automáticos; se você não fizer isso, a correção falhará e você será desqualificado). Campos marcados com asterisco são obrigatórios. 

    Para o campo `country`, apenas os seguintes países serão suportados:

    * AR - Argentina
    * BR - Brasil
    * CL - Chile
    * CO - Colômbia
    * CR - Costa Rica
    * CU - Cuba
    * DO - República Dominicana
    * EC - Equador
    * FR - França
    * GF - Guiana Francesa
    * GT - Guatemala
    * HN - Honduras
    * HT - Haiti
    * IT - Itália
    * JM - Jamaica
    * MX - México
    * NI - Nicarágua
    * PA - Panamá
    * PE - Peru
    * PR - Porto Rico
    * PY - Paraguai
    * SV - El Salvador
    * US - Estados Unidos
    * UY - Uruguai
    * VE - Venezuela 

    O código de duas letras no início de cada elemento é o que deve ser enviado ao backend ao submeter o formulário e _não deve ser exibido_ ao usuário.

    Para fins de simplificação, o campo `zipCode` receberá apenas CEPs no formato usado no Brasil.

    Deve haver um botão cujo id seja `submit` para enviar os dados. 

    O envio será feito para o backend via POST no endereço `https://www.improving.com.br/api/test/users` no seguinte formato JSON:

    > {
    > 	"email": "vagas.tl@improving.com.br",
    > 	"password": "minhaSenha",
    > 	"fullName": "Fulano de Tal",
    > 	"birthDate": "05/11/1982",
    > 	"zipCode": "12345678",
    > 	"streetName": "Rua Ipiranga",
    > 	"number": "1000",
    > 	"complement": "conjunto 23",
    > 	"neighbourhood": "Centro",
    > 	"country": "BR",
    > 	"state": "São Paulo",
    > 	"city": "São Paulo"
    > }

    O backend responderá com os seguintes códigos:

    * 200 - O cadastro foi feito com sucesso. Neste caso, será retornado um json com o seguinte formato `{"token": "0a1b2c3d4e5f6789"}` no corpo da requisição e você deverá seguir para o passo 2 do exercício;
    * 400 - Há um erro com ums dos dados que deve ser exibido para o usuário, para que corrija e submeta novamente. Neste caso, será retornado um json no corpo da requisição com o seguinte formato `{"message": "CEP inconsistente com o endereço"}`;
    * 409 - O email informado já existe. Uma mensagem deve ser exibida para o usuário;
    * Qualquer código 5xx ou erro de timeout - Deve ser exibida uma mensagem de que houve um erro de comunicação e o usuário deve tentar novamente mais tarde.

1. Após o cadastro bem-sucedido, deve ser exibido um painel com dois gráficos, no formato que você achar mais apropriado, cujos dados poderão ser obtidos chamando as APIs conforme discriminado abaixo:
    * Distribuição dos acessos por browser ( `https://www.improving.com.br/api/test/hits-by-browser` ):
        * O formato retornado pela API será `[["Firefox", 1038],["IE", 5633],["Chrome", 2403],["Safari", 477],["Opera", 91]]` , ou seja, o nome do browser seguido pela quantidade de acessos feita com ele;
        * Você deverá exibir a _distribuição percentual_ dos acessos por browser no gráfico;
        * Os percentuais devem ser arredondados na *segunda* casa decimal de acordo com arredondamento financeiro (ex: 15.541 deve ser 15.54; 15.545 deve ser 15.55); 
    * Temperatura média por mês ( `https://www.improving.com.br/api/test/city-temperatures` ):
        * O formato retornado pela API será `[{"name":"Tokyo","data":[["01-01",7],["02-01",6.9],["03-01",9.5],["04-01",14.5],["05-01",18.4],["06-01",21.5],["07-01",25.2],["08-01",26.5],["09-01",23.3],["10-01",18.3],["11-01",13.9],["12-01",9.6]]},{"name":"London","data":[["01-01",3.9],["02-01",4.2],["03-01",5.7],["04-01",8.5],["05-01",11.9],["06-01",15.2],["07-01",17],["08-01",16.6],["09-01",14.2],["10-01",10.3],["11-01",6.6],["12-01",4.8]]}]`, ou seja:
            * Nome de uma cidade (serão enviadas entre duas e cinco no máximo, sempre);
            * Array em que cada elemento é um dia/mês (`12-01` é 12 de janeiro) e a temperatura média daquele dia;
        * Embora nos dados de exemplo hajam apenas 12 dias, a API sempre retornará dados para todos os dias do ano - porém, os dados _poderão estar fora de ordem_;
        * A temperatura média de cada mês deve ser calculada com média aritmética simples e arredondamento na *primeira* casa decimal de acordo com a mesma regra do item acima

    As chamadas são feitas via POST (para facilitar a implementação) usando o token retornado no passo anterior no corpo da requisição e no mesmo formato em que foi retornado, ou seja, `{"token": "0a1b2c3d4e5f6789"}` . O backend responderá com os seguintes códigos:

    * 200 - Chamada com sucesso. Os dados serão retornados conforme especificado acima;
    * 400 - Há algum erro com o seu formato de requisição;
    * Qualquer código 5xx ou erro de timeout - Deve ser exibida uma mensagem de que houve um erro de comunicação e o usuário deve tentar novamente mais tarde.

    Além dos gráficos, deverá haver um botão cujo id deve ser `tableMode` que, ao ser clicado, exibirá os mesmos dados como tabelas _exatamente com os seguintes conteúdos_ (a fonte, o tamanho das colunas e as bordas são irrelevantes):
    
    Tabela com dados de distribuição de acessos:

    
    Browser | Distribuição (%)
    ------- | ---------------:
    Chrome  | 50,12
    Firefox | 20,88
    IE      | 22,00
    Opera   |  1,15
    Safari  |  5,85


    Tabela com a média de temperaturas:


    Cidade         | Jan  | Fev  | Mar  | Abr  | Mai  | Jun  | Jul  | Ago  | Set  | Out  | Nov  | Dez
    ---------------|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|-----:|----:
    New York       | 0,5  | 1,5  | 6,0  | 11,5 | 17,0 | 22,0 | 24,5 | 24,0 | 20,0 | 14,0 | 9,5  | 3,0
    Rio de Janeiro | 26,2 | 27,0 | 26,1 | 25,3 | 23,9 | 22,7 | 21,4 | 22,6 | 22,8 | 23,7 | 24,0 | 25,9
    Tokyo          | 5,5  | 6,6  | 9,1  | 14,6 | 18,2 | 21,0 | 25,5 | 26,2 | 23,4 | 18,6 | 12,3 | 8,0

    Note que nas tabelas os dados devem estar ordenados por ordem alfabética dos dados da primeira coluna. Nos gráficos, use a ordem que achar que faz mais sentido.