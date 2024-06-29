# Code Server 

## Overview

This Server provides a platform to run and test code snippets in various programming languages. It offers three main endpoints: `/test-code`, `/run-code`, and `/supported-languages`.
following the code-tutor architecture, the server send its results to the main server and student ui
## Endpoints

### `/run-code`

- **Method**: POST
- **Description**: Executes a code snippet in a specified language.
- **Request Body**:
    ```json
    {
      "language": "py",
      "code": "print('Hello, world!')",
      "input": "optional input"
    }
    ```
- **Response**:
    ```json
    {
      "error": null,
      "language": "py",
      "output": "Hello, world!\n",
      "status": "success"
    }
    ```

### `/test-code`

- **Method**: POST
- **Description**: Runs a code snippet and verifies it against provided test cases.
- **Request Body**:
    ```json
    {
      "language": "py",
      "description": "a simple test for counting vowels in a string",
      "functionCall": null,
      "code": "def count_vowels(s):\n\tvowels = 'aeiou'\n\treturn sum(1 for char in s if char in vowels)\n\ninput_str = 'hello world'\noutput_count = count_vowels(input_str)\nprint(output_count)",
      "tests": [
        {
          "input": null,
          "description": "must count the number of vowels in 'hello world'",
          "expectedOutput": "3",
          "passed": null
        }
      ]
    }
    ```
- **Response**:
    ```json
    {
      "tests": [
        {
          "input": null,
          "description": "must count the number of vowels in 'hello world'",
          "expectedOutput": "3",
          "output": "3",
          "passed": true
        }
      ]
    }
    ```

### `/supported-languages`

- **Method**: GET
- **Description**: Returns a list of supported programming languages.
- **Response**:
    ```json
    {
      "languages": ["python", "javascript", "java", "go", "c++", "c#", "c", "typescript"]
    }
    ```

## Installation and Setup

### Prerequisites

- Node.js
- npm

### Steps to Install

1. **Clone the repository**:
    ```sh
    git clone https://github.com/code-tutor/code-tutor.git
    cd code-serever
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Start the development server**:
    ```sh
    npm run dev
    ```

### Local Testing Requirements

To run code snippets locally, ensure that the necessary compilers and SDKs for the following languages are installed on your machine:

- **Python**
- **Java**
- **Go**
- **C++**
- **C#**
- **C**
- **TypeScript**
- **JavaScript**

#### Installing Compilers and SDKs

- **Python**:
    ```sh
    sudo apt-get install python3
    ```
- **Java**:
    ```sh
    sudo apt-get install openjdk-11-jdk
    ```
- **Go**:
    ```sh
    sudo apt-get install golang
    ```
- **C++**:
    ```sh
    sudo apt-get install g++
    ```
- **C#**:
    ```sh
    sudo apt-get install mono-devel
    ```
- **C**:
    ```sh
    sudo apt-get install gcc
    ```
- **TypeScript**:
    ```sh
    npm install -g typescript
    ```
- **JavaScript**:
    ```sh
    npm install -g node
    ```

### Example Usage

1. **Running a Python code snippet**:
    ```sh
    curl -X POST http://localhost:3000/run-code -H "Content-Type: application/json" -d '{
      "language": "py",
      "code": "print(\"Hello, world!\")"
    }'
    ```

2. **Testing a Python function**:
    ```sh
    curl -X POST http://localhost:3000/test-code -H "Content-Type: application/json" -d '{
      "language": "py",
      "description": "a simple test for counting vowels in a string",
      "functionCall": null,
      "code": "def count_vowels(s):\n\tvowels = \"aeiou\"\n\treturn sum(1 for char in s if char in vowels)\n\ninput_str = \"hello world\"\noutput_count = count_vowels(input_str)\nprint(output_count)",
      "tests": [
        {
          "input": null,
          "description": "must count the number of vowels in \"hello world\"",
          "expectedOutput": "3",
          "passed": null
        }
      ]
    }'
    ```


