# Student UI (React)

This is the student UI for the application, built with React and Vite. 
## Tech Stack
1. Context API
2. React Query
3. Shadcn UI 
4. Monaco Editor. 
The folder structure follows the Next.js 13 convention for arranging pages, grouping similar pages together with their nearest layout in the same folder. This logically groups related pages together.

## Folder Structure
```
project-root/
├── public/
│ ├── index.html
│
├── src/
│ ├── assets/
│ ├── components/
│ ├── providers/
│ ├── hooks/
│ ├── pages/
│ │ ├── (root)/
│ │ │ ├── index.tsx
│ │ │ ├── RootPage.tsx
│ │ │ ├── RootLayout.tsx
│ │ │ └── ...other root pages
│ │ ├── (marketing)/
│ │ │ ├── index.tsx
│ │ │ ├── MarketingPage.tsx
│ │ │ ├── MarketingLayout.tsx
│ │ │ └── ...other marketing pages
│ │ ├── (challenges)/
│ │ │ ├── index.tsx
│ │ │ ├── ChallengesPage.tsx
│ │ │ ├── ChallengesLayout.tsx
│ │ │ └── ...other challenges pages
│ │ └── ...other similar page groups
│ ├── utils/
│ ├── App.tsx
│ ├── index.tsx
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
    git clone https://github.com/your-repo/student-ui.git
    cd student-ui
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:

    ```env
    VITE_CODE_SERVER_URL=your-code-server-url
    VITE_MAIN_SERVER_URL=your-main-server-url
    ```

4. **Run the application**:
    ```sh
    npm run dev
    ```

5. **Check the style guide**:
    - Open your browser and navigate to [style-guide](http://localhost:5173/style-guide)

