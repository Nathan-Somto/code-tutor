# Teacher UI (Vue)

User Interface for Teachers or Instructors, they are in charge of generating content for the code-tutor.

## Folder Structure
```
project-root/
├── public/
│ ├── index.html
│
├── src/
│ ├── assets/
│ ├── components/
│ ├── services/
│ ├── lib/
│ ├── constants/
│ ├── store/
│ ├── views/
│ │ ├── HomeView.vue
│ ├── App.vue
│ ├── main.ts
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```


## Installation

### Prerequisites

- Node.js
- npm

### Steps to Install

1. **Clone the repository**:
    ```sh
    git clone https://github.com/code-tutor/teacher-ui.git
    cd teacher-ui
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Run the application**:
    ```sh
    npm run dev
    ```

### Production Setup

In a production environment, compile and minify the application for production:

```sh
npm run build
```

