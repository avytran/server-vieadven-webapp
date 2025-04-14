# 🌐 Express TypeScript Server

This project is a server-side application built with **Express.js** and **TypeScript**. It provides a robust, type-safe backend framework for developing APIs or web applications.

---

## 🚀 Features

- 🛠 **TypeScript** for enhanced type safety and developer experience.
- ⚡ **Express.js** for fast and minimalist web framework functionality.
- 🔄 Middleware support for JSON parsing and routing.
- 📂 Organized project structure for scalability and maintainability.

---

## 📚 Tech Stack

- **Node.js**: Runtime environment for JavaScript.
- **Express.js**: Minimal and flexible Node.js web application framework.
- **TypeScript**: Superset of JavaScript with static typing.

---

## 📂 Project Structure

```plaintext
.
├── src
│   ├── index.ts       # Entry point of the application
│   ├── routes         # API routes
│   │   └── index.ts   # Example route
│   └── middleware     # (Optional) Custom middleware
├── dist               # Compiled JavaScript files (output directory)
├── tsconfig.json      # TypeScript configuration
├── nodemon.json       # Nodemon configuration
├── package.json       # NPM configuration
└── README.md          # Project documentation
```

## 🔧 Setup and Installation
1. **Clone the repository**:
```bash
git clone https://github.com/etclubdev/server-et-webapp.git
cd express-ts-server
```
2. **Install dependencies**:
```bash
npm install
```
3. **Start the development server**:
```bash
npm run dev
```
4. **Build for production**:
```bash
npm run build
```
5. **Run the production build**:
```bash
npm start
```
## 📜 Scripts
```bash
npm run dev: //Starts the server in development mode with ts-node and nodemon.
npm run build: //Compiles TypeScript into JavaScript in the dist folder.
npm start: //Runs the compiled JavaScript from the dist folder.
```