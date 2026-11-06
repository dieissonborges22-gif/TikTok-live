# TikTok LIVE Studio

Aplicativo próprio de personagem virtual para interagir com uma LIVE do TikTok. O projeto usa Node.js, Socket.IO e a biblioteca comunitária `tiktok-live-connector`.

## Recursos desta versão

- Conexão a uma LIVE pública pelo @ do criador (não informe senha).
- Recepção de comentários, curtidas, presentes, entradas, follows, compartilhamentos e contagem de espectadores, conforme os eventos disponibilizados pelo conector.
- Respostas automáticas a comentários com intervalo de segurança por usuário e limite global.
- Respostas locais gratuitas quando a IA não está configurada ou falha.
- Integração opcional com Google Gemini por variável de ambiente.
- Voz do navegador/Windows via Speech Synthesis, com seleção de voz em português quando disponível.
- Painel com métricas, chat recente e botões de simulação.
- Página utilizável como fonte de navegador no OBS: `http://localhost:3000`.

## Requisitos

- Windows 10/11, Linux ou macOS.
- Node.js 20 ou superior.
- Conexão com a internet para receber eventos do TikTok.
- Navegador com Speech Synthesis e voz instalada para áudio local.

## Instalação

1. Instale o Node.js 20+.
2. Baixe/clique em **Code → Download ZIP** neste repositório e extraia a pasta.
3. Abra um terminal dentro da pasta do projeto.
4. Execute:

```bash
npm install
```

5. (Opcional) Copie `.env.example` para `.env` e adicione sua chave Gemini. Sem chave, o modo de respostas locais continua funcionando.
6. Inicie:

```bash
npm start
```

7. Abra `http://localhost:3000`.

## Configurar IA opcional

No arquivo `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash-lite
PORT=3000
```

A chave fica somente no seu computador e não deve ser enviada ao GitHub. O uso gratuito de serviços externos pode ter cotas, limites e alterações de disponibilidade; por isso o modo local é o fallback.

## Usar no OBS

Adicione uma **Fonte de navegador** com o endereço `http://localhost:3000`. Para capturar áudio, habilite a opção de controle de áudio da fonte no OBS e confira o dispositivo de saída do navegador.

## Testar sem estar ao vivo

Use os botões **Testar curtida**, **Testar presente**, **Testar entrada** e **Enviar teste**. Eles verificam as reações e a voz sem conectar ao TikTok.

## Segurança e limitações

- Informe apenas o @ público da conta. O aplicativo não pede senha, cookie ou código de autenticação.
- O conector depende de uma interface não oficial do TikTok e pode parar de funcionar se a plataforma mudar seus protocolos.
- Nem todo tipo de evento é entregue em todas as lives/contas; o painel mostra apenas o que o conector receber.
- A voz do navegador é gratuita, mas a disponibilidade de vozes femininas em português depende das vozes instaladas no sistema.
- O modo IA via Gemini é opcional e sujeito às cotas e regras do provedor.
- Respostas automáticas são limitadas para evitar spam e repetição.
- Antes de usar em uma live pública, teste com comentários e presentes simulados e ajuste o volume.

## Próximas etapas planejadas

1. Painel de personalidade e regras editáveis para cada evento.
2. Fila de fala configurável e prioridade para presentes.
3. Avatar 2D/3D próprio com animações de expressão, dança e sincronização labial por áudio.
4. Controles de moderação e lista de palavras bloqueadas.
5. Empacotamento para Windows.

Este projeto é independente e não é afiliado ao TikTok.
