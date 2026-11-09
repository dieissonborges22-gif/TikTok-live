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

## Recursos desta versão\n- Avatar 3D procedural via Three.js, carregado pelo navegador a partir de CDN.
- Respostas aos comentários com Ollama.
- Voz sintetizada pela Cartesia.
- Reações a comentários, presentes, curtidas em lotes e entrada de espectadores.
- Animação de comemoração “SIUUU” para presentes.
- Painel para testar IA, voz e reação.

## Limitações
- O avatar agora é renderizado em 3D em tempo real com Three.js e geometria procedural, com rotação por arraste, animação de fala e comemoração. É um personagem 3D estilizado inspirado no futebol, não um modelo fotorealista nem uma reprodução exata do rosto do atleta.
- A sincronização da boca é uma animação aproximada durante a reprodução do áudio; não é captura fonema a fonema.
- A integração TikTok depende de uma biblioteca não oficial e pode mudar com o protocolo do TikTok.
- O endereço localhost do Ollama só funciona se o Ollama estiver no mesmo computador/ambiente de rede do servidor.
- Cartesia pode consumir créditos conforme o plano da conta.
- Nunca publique o arquivo `.env` nem compartilhe a chave Cartesia.