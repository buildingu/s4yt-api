
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
MONGO_URI=mongodb://localhost:27017
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

# Running Builds for TypeScript Files

## **Using Webpack for Project Builds**
Our Webpack configuration allows you to build the entire project or individual TypeScript files with ease. Here's how you can use it:

### **Build the Entire Project**
To build the entire project, simply run:

```bash
npm run build
```

- This command compiles all TypeScript files in the project using Webpack.
- The output will be placed in the `build/` directory, with the main entry point being `build/server.cjs`.

---

## **Building Individual TypeScript Files**
You can also build individual TypeScript files without running the entire project build. This is useful for testing or running specific utilities like seeders.

### **Using Webpack for Individual Builds**
To build a specific TypeScript file using Webpack, you need to pass the file as an entry point. Here's an example for building `src/v2/seeder.ts`:

```bash
npx webpack --entry ./src/v2/seeder.ts --output-path ./build/seeder --output-filename seeder.js
```

- **`--entry`**: Path to the TypeScript file you want to build.
- **`--output-path`**: Directory where the output will be placed (e.g., `build/seeder/`).
- **`--output-filename`**: Name of the output file (e.g., `seeder.js`).

After running this command:
- The transpiled JavaScript file will be available in the specified output directory (e.g., `build/seeder/seeder.js`).

### **Using `tsc` for Quick Transpilation**
For a quick build of a single file without Webpack, you can use the TypeScript compiler:

```bash
npx tsc src/v2/seeder.ts --outDir build --module commonjs
```

- The transpiled file will be placed in the `build/` directory, preserving the directory structure of the source file.

### **Using `ts-node` for Execution**
To directly execute a TypeScript file without building it, you can use `ts-node`:

```bash
npx ts-node src/v2/seeder.ts
```

This approach is great for quick testing but does not produce a separate build file.

---

## **Output Directory Structure**
All builds, whether for the entire project or individual files, will be output to the `build/` directory. The structure mirrors the source directory (`src/`) for easy navigation.

For example:
- Source file: `src/v2/seeder.ts`
- Build file: `build/v2/seeder.js`

---

# Seeding the Database

To seed the database, simply run:

```bash
npm run seedDB
```

The following collections will be *cleared* and seeded with test data:

- Users
- Businesses
- Challenges
- Answers
- Raffle Items
- Raffle Partners

The raw data can be found in `src/v2/seeders/data`. New entries can be added to raw data as long as they conform to the model schemas found in `src/v2/models`.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
