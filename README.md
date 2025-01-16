
# s4yt-api

This repository contains the back-end REST API for the special event/game **Dollars for Your Thoughts ($4YT)**, part of the Building-u project.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Express.js**: Backend framework for handling requests.
- **MongoDB**: Database for storing data.
- **Socket.IO**: Real-time communication.
- **Security**: Implements security best practices with Helmet, CORS, and rate limiting.
- **Logging**: Winston for application logging.
- **Authentication**: JSON Web Tokens (JWT) for user authentication.

---

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/buildingu/s4yt-api.git
   cd s4yt-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the MongoDB container:
   ```bash
   docker-compose up -d
   ```

4. Create a `.env` file from the `example.env` file in the root directory and configure the required environment variables.

5. Access the API at [http://localhost:4000](http://localhost:4000).

---

## Scripts
The following scripts are available in the `package.json` file:

- **`npm run dev`**: Starts the development server with `nodemon`.
- **`npm run build`**: Builds the project using Webpack.
- **`npm run serve`**: Starts the production server.
- **`npm run check-ts`**: Runs TypeScript checks without emitting files.
- **`npm run clean`**: Removes `node_modules`.

---

## Docker Setup
This project uses Docker to manage MongoDB. The configuration is defined in the `docker-compose.yml` file. Make sure to have docker installed. [Docker-Install-Instruction](https://docs.docker.com/desktop/)

### Steps to Run MongoDB:
1. Ensure Docker is running.
2. Start MongoDB with:
   ```bash
   docker-compose up -d
   ```
3. MongoDB will be available at `localhost:27017`.

---

## Environment Variables
The application requires the following environment variables:

```plaintext
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://root:example@localhost:27017/s4yt?authSource=admin
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
```

Create a `.env` file FROM THE `example.env` in the root directory and add the variables above.

---

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
