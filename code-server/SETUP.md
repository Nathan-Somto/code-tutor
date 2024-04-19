# Setup Code-Server Locally
install the listed packages, compilers and sdks for the supported languages 

### Install project (using Docker)

```bash
docker build --no-cache -t code-server .

docker run -p 3000:3000 code-server
```
