# Pixel LIVE Studio — versão 1.0

Aplicativo local para lives do TikTok com personagem 3D próprio, respostas automáticas, voz e overlay transparente para OBS.

## O que esta versão entrega

- **Avatar 3D autoral:** personagem feminina estilizada, construído em tempo real com Three.js (malhas, materiais, iluminação e animações; não é um vídeo nem uma imagem 2D).
- **Animações:** respiração, movimento de cabeça, piscadas, fala, reações a curtidas, presentes, entradas, follows e compartilhamentos.
- **Boca animada:** movimento sincronizado com a fala sintetizada do navegador.
- **TikTok LIVE:** integração com `tiktok-live-connector 2.5.x`, usando o formato atual de eventos e campos aninhados.
- **Respostas automáticas:** respostas locais imediatas, em português, sem chave de IA; opção Gemini para respostas mais específicas.
- **Controles:** personalidade editável, voz, velocidade, volume, testes de eventos, métricas e chat recente.
- **OBS:** página limpa e transparente em `http://127.0.0.1:3000/overlay`.

## Requisitos

- Windows 10/11 (ou Linux/macOS).
- Node.js 20.18 ou superior.
- Internet para receber eventos do TikTok e carregar Three.js do CDN.
- Navegador Chromium/OBS com WebGL habilitado e voz em português instalada para melhor resultado de áudio.

## Instalação no Windows

1. Instale Node.js 20 LTS ou superior.
2. Baixe o ZIP desta branch pelo GitHub e extraia.
3. Abra o Prompt de Comando ou PowerShell dentro da pasta extraída.
4. Instale as dependências:

```powershell
npm install
```

5. Opcional: copie `.env.example` para `.env` e informe sua chave Gemini.
6. Inicie o aplicativo:

```powershell
npm start
```

7. Abra no navegador: `http://127.0.0.1:3000`.

## Usar no OBS

1. Adicione uma **Fonte de navegador**.
2. Endereço: `http://127.0.0.1:3000/overlay`.
3. Resolução sugerida: 1920 × 1080.
4. Marque a opção para controlar/ativar o áudio da fonte de navegador no OBS.
5. Selecione uma voz brasileira no painel de controle. A disponibilidade de voz feminina depende das vozes instaladas no Windows/Chromium.

O painel de controle fica em `http://127.0.0.1:3000/`. O overlay é separado e não mostra botões nem métricas na transmissão.

## Conexão com o TikTok

Digite somente o @ público da conta que está ao vivo. Não informe senha, cookies ou códigos. O conector lê eventos públicos e não envia mensagens ao chat.

Eventos tratados: chat, curtidas, presentes (com encerramento de streak), entradas, seguidores, compartilhamentos, perguntas e espectadores, conforme o TikTok disponibilizar e o conector decodificar.

## Respostas e IA

- Sem configuração, o app usa respostas locais rápidas e não depende de API paga.
- Gemini é opcional: crie `.env` com `GEMINI_API_KEY` e, se quiser, `GEMINI_MODEL=gemini-2.5-flash-lite`.
- A chamada da IA tem timeout curto; se não responder a tempo, o app usa uma resposta local.
- Serviços gratuitos de terceiros podem ter cotas, limites e mudanças. Não existe promessa de IA ilimitada.

Exemplo de `.env`:

```env
PORT=3000
HOST=127.0.0.1
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

## Testes

- Execute `npm run check` para verificar a sintaxe do servidor.
- No painel, teste curtida, presente, entrada, seguir, compartilhar e mensagem.
- Confira `http://127.0.0.1:3000/health` para verificar se o servidor iniciou.
- Teste primeiro em uma LIVE privada/de teste ou com uma transmissão pública controlada.

## Segurança e limitações

- O servidor escuta em `127.0.0.1` por padrão, evitando expor o painel à rede local.
- A conexão de leitura do TikTok usa um projeto comunitário não oficial. O TikTok pode alterar o protocolo e nem todo evento aparece em toda região ou LIVE.
- A página 3D carrega Three.js pelo CDN jsDelivr; é necessária conexão à internet na primeira abertura.
- A sincronização da boca é animada durante o áudio sintetizado; não é captura fonema a fonema de estúdio.
- A qualidade e naturalidade da voz dependem do mecanismo de voz instalado no computador.
- O avatar é um modelo 3D estilizado e procedural criado no código. Modelos 3D realistas personalizados exigem um arquivo VRM/GLB e licenças próprias.
- O aplicativo não envia respostas escritas ao chat do TikTok; ele fala as respostas pelo avatar.

## Tecnologias e referências

- Node.js + Express + Socket.IO.
- TikTok LIVE Connector 2.5.x (eventos e payloads atuais).
- Three.js para o personagem 3D e animações no navegador.
- SpeechSynthesis para voz local.
- Gemini opcional para respostas de IA.

Projeto independente, sem afiliação ao TikTok/ByteDance.
