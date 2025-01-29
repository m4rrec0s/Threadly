# Threadly

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Threadly é uma aplicação de rede social onde os usuários podem compartilhar postagens, seguir uns aos outros, curtir e comentar em postagens. A aplicação é dividida em duas partes: o backend, que fornece a API RESTful, e o frontend, que é a interface do usuário.

## Funcionalidades

### Autenticação

- **Registrar Usuário**
- **Login**
- **Logout**

### Usuários

- **Atualizar Perfil**
- **Seguir e Deixar de Seguir Usuários**
- **Listar Seguidores e Seguindo**

### Postagens

- **Criar Postagem**
- **Listar Postagens**
- **Deletar Postagem**
- **Curtir e Descurtir Postagens**

### Comentários

- **Criar Comentário**
- **Listar Comentários**
- **Deletar Comentário**

### Respostas

- **Criar Resposta**
- **Listar Respostas**
- **Deletar Resposta**

## Tecnologias Utilizadas

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF5733?style=for-the-badge&logo=multer&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

## Instalação

### Backend

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

### Frontend

1. Navegue até o diretório do frontend:

   ```sh
   cd ../frontend
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```sh
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

Feito com ❤️ por [M4rrec0s](https://github.com/m4rrec0s).
