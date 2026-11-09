# CR7 Virtual LIVE — V2

Versão de desenvolvimento separada do app original. O personagem é um avatar virtual de fã inspirado no universo de Cristiano Ronaldo; não representa nem fala em nome do jogador real.

## Requisitos
- Node.js 20 ou superior.
- Dependências da raiz do repositório instaladas (`npm install`).
- Ollama ativo e acessível pelo servidor; modelo `gemma4:e4b` instalado.
- Chave Cartesia e Voice ID de uma voz masculina disponível na sua conta.

## Configurar e iniciar
1. Copie `.env.example` para `.env` dentro de `live3d-v2`.
2. Preencha `CARTESIA_API_KEY` e `CARTESIA_VOICE_ID` com uma voz masculina da sua conta.
3. Confirme `OLLAMA_URL` e `OLLAMA_MODEL`.
4. Na raiz do repositório, execute `npm install`.
5. Execute `node live3d-v2/server.js`.
6. Abra `http://localhost:3000`.

## OBS
Adicione a URL do painel como Fonte de Navegador. Se OBS e servidor estiverem em computadores diferentes, use o endereço de rede do computador servidor.

## Recursos desta versão
- Respostas aos comentários com Ollama.
- Voz sintetizada pela Cartesia.
- Reações a comentários, presentes, curtidas em lotes e entrada de espectadores.
- Animação de comemoração “SIUUU” para presentes.
- Painel para testar IA, voz e reação.

## Limitações
- O avatar atual é uma ilustração CSS 2D animada, ainda não é um modelo 3D real nem captura facial avançada.
- A sincronização de boca nesta etapa é uma animação simples durante o áudio.
- A integração TikTok depende de uma biblioteca não oficial e pode mudar com o protocolo do TikTok.
- O endereço localhost do Ollama só funciona se o Ollama estiver no mesmo computador/ambiente de rede do servidor.
- Cartesia pode consumir créditos conforme o plano da conta.
- Nunca publique o arquivo `.env` nem compartilhe a chave Cartesia.