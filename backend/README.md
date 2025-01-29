# Threadly Backend

Este é o backend do projeto Threadly, uma API RESTful construída com Node.js, Express e Prisma. A API fornece funcionalidades para gerenciamento de usuários, postagens, comentários, curtidas, seguidores e respostas.

## Tecnologias Utilizadas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF5733?style=for-the-badge&logo=multer&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/m4rrec0s/Threadly.git
   cd Threadly/backend
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure o banco de dados:

   ```sh
   npx prisma migrate dev
   ```

4. Inicie o servidor:
   ```sh
   npm run dev
   ```

## Endpoints

### Autenticação

- **Login**
  - **POST** `/login`
  - Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

### Usuários

- **Registrar Usuário**

  - **POST** `/register`
  - Body:
    ```json
    {
      "name": "string",
      "email": "string",
      "username": "string",
      "password": "string"
    }
    ```

- **Atualizar Usuário**

  - **PUT** `/users/:id`
  - Body:
    ```json
    {
      "name": "string",
      "email": "string",
      "username": "string",
      "password": "string"
    }
    ```

- **Listar Usuários**
  - **GET** `/users`

### Postagens

- **Criar Postagem**

  - **POST** `/posts`
  - Body:
    ```json
    {
      "content": "string",
      "user_id": "string",
      "images": File,
    }
    ```

- **Listar Postagens**

  - **GET** `/posts`

- **Obter Postagem por ID**

  - **GET** `/posts/:id`

- **Deletar Postagem**
  - **DELETE** `/posts/:id`

### Comentários

- **Criar Comentário**

  - **POST** `/comments`
  - Body:
    ```json
    {
      "content": "string",
      "author_id": "string",
      "post_id": "string"
    }
    ```

- **Listar Comentários**

  - **GET** `/comments`

- **Obter Comentários por Postagem**

  - **GET** `/comments/post/:post_id`

- **Deletar Comentário**
  - **DELETE** `/comments/:id`

### Curtidas

- **Curtir Postagem**

  - **POST** `/likes`
  - Body:
    ```json
    {
      "user_id": "string",
      "post_id": "string"
    }
    ```

- **Listar Curtidas**

  - **GET** `/likes`

- **Remover Curtida**
  - **DELETE** `/likes`
  - Body:
    ```json
    {
      "user_id": "string",
      "post_id": "string"
    }
    ```

### Seguidores

- **Seguir Usuário**

  - **POST** `/follow`
  - Body:
    ```json
    {
      "follower_id": "string",
      "following_id": "string"
    }
    ```

- **Deixar de Seguir Usuário**

  - **POST** `/unfollow`
  - Body:
    ```json
    {
      "follower_id": "string",
      "following_id": "string"
    }
    ```

- **Listar Seguidores**

  - **GET** `/followers/:user_id`

- **Listar Seguindo**
  - **GET** `/following/:user_id`

### Respostas

- **Criar Resposta**

  - **POST** `/answers`
  - Body:
    ```json
    {
      "content": "string",
      "author_id": "string",
      "comment_id": "string"
    }
    ```

- **Listar Respostas**

  - **GET** `/answers`

- **Atualizar Resposta**

  - **PUT** `/answers/:id`
  - Body:
    ```json
    {
      "content": "string"
    }
    ```

- **Deletar Resposta**
  - **DELETE** `/answers/:id`

## Estrutura do Projeto

- **src/**
  - **config/**: Configurações do multer.
  - **controllers/**: Controladores das rotas.
  - **types/**: Definições de tipos TypeScript.
  - **utils/**: Utilitários como gerenciador de JWT.
  - **routes.ts**: Definição das rotas.
  - **server.ts**: Inicialização do servidor.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Faça um push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença ISC.

---

Feito com ❤️ por [M4rrec0s](https://github.com/m4rrec0s).
