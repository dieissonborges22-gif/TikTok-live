# Live 3D V2 — Cartesia + Ollama

Nova versão separada da aplicação original.

## Requisitos
- Node.js 20 ou superior.
- Dependências já declaradas no `package.json` da raiz do repositório.
- Ollama instalado e executando no computador/servidor que hospeda esta aplicação.
- Modelo Ollama baixado: `ollama pull gemma4:e4b`.
- Chave Cartesia e um ID de voz habilitado na conta.

## Iniciar
Na raiz do repositório:
1. Instale as dependências: `npm install`.
2. Copie `live3d-v2/.env.example` para `live3d-v2/.env`.
3. Preencha `CARTESIA_API_KEY` no arquivo privado `.env`.
4. Confira `OLLAMA_URL`, `OLLAMA_MODEL` e `CARTESIA_VOICE_ID`.
5. Inicie com `node live3d-v2/server.js`.
6. Abra `http://localhost:3000`.

## OBS
Adicione `http://localhost:3000` como Fonte de Navegador. Se o OBS estiver em outro computador, use o endereço de rede do computador que está executando o servidor.

## Importante
- Nunca envie o arquivo `.env` ao GitHub. Ele contém a chave privada da Cartesia.
- O endereço `127.0.0.1:11434` aponta para o próprio computador do servidor. Em hospedagem remota, configure uma URL de Ollama que o servidor consiga acessar com segurança.
- O uso da Cartesia pode consumir créditos ou ser cobrado conforme o plano da conta.
- A conexão TikTok usa biblioteca não oficial e pode sofrer alterações quando o TikTok mudar seu protocolo.
- O avatar nesta versão é uma representação 2D inicial. A estrutura está preparada para evoluir para um avatar 3D com animações e lip-sync.
