# Sinergia Test - Copia do Twitter

## API Rest Similar ao Twitter

## Instalação

```
$ git clone https://github.com/FernandoCendretti/.git
$ cd copy-twitter
$ npm install || yarn
```

É necessário ter o postgres e caso tenha o Docker, basta executar o comando:

```
sudo docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

Para executar o sistema basta executar o comando:

```
yarn dev
```
O sistema consta com alguns testes de integração, basta executar o comando:

```
yarn test
```
Não esqueça de configurar as variaveis de ambientes do banco de dados, vá até o arquivo ".env" renomeie e retire o ".example" do final, a adicionde as configurações do seu banco nessas variáveis
```
DB_HOST= Host do banco
DB_USER= Usuário do banco
DB_PASS= Senha de acesso ao banco
DB_NAME= Nome do banco de dados
```
