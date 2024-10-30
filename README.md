Este repositório contém uma API de gerenciamento de sessões de usuários desenvolvida com Node.js, Express e SQLite. A API permite criar, consultar, atualizar e deletar sessões de usuários, oferecendo funcionalidades como conexão e desconexão de usuários, bem como a obtenção do status e da duração das sessões.

Funcionalidades:
Criação de Sessões: Permite que usuários criem novas sessões.

Consulta de Sessões: Permite a consulta do número de usuários online.

Desconexão de Usuários: Permite que usuários desconectem suas sessões.

Status dos Usuários: Obtém o status atual dos usuários.

Duração da Sessão: Calcula a duração da sessão de um usuário.

Estrutura do Projeto:
controllers/: Contém a lógica de manipulação dos dados.

routers/: Define as rotas da API.

configDB.js: Configuração e conexão com o banco de dados SQLite.

server.js: Configuração do servidor e inicialização da aplicação.

Instruções de Uso:
Clone o repositório.

Instale as dependências com npm install.

Inicie o servidor com node server.js.

A API estará disponível em http://localhost:3000.
