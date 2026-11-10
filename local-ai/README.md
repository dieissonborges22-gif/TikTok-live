# Pixel LIVE AI — configuração local para PC com 8 GB RAM

Este complemento liga a Event API do TikFinity a um modelo local do Ollama e a voz do Windows no navegador. A IA não envia comentários para serviços de IA na nuvem. A primeira instalação precisa de internet para baixar programas/modelo; depois o modelo e a fala funcionam localmente. A conexão da LIVE sempre precisa de internet.

## Perfil recomendado para 8 GB

- Ollama com `qwen2.5:0.5b` (modelo pequeno, CPU).
- Contexto e respostas curtas.
- VSeeFace com modelo VRM 0.x leve, sem efeitos pesados.
- OBS a 720p/30 FPS inicialmente.
- Feche navegador com muitas abas, jogos e outros programas.
- A Vega 3 usa memória compartilhada; não force camadas de IA na GPU.

O modelo 0.5B é uma escolha de compromisso para 8 GB, não uma IA de qualidade alta. Se ficar lento, desative o rastreamento facial ou use respostas locais simples. O processador ainda não foi identificado, então velocidade não pode ser garantida.

## 1. Instalar Ollama e modelo

Baixe Ollama para Windows em https://ollama.com/download/windows. Depois abra CMD e rode:

```cmd
ollama pull qwen2.5:0.5b
ollama run qwen2.5:0.5b
```

Quando aparecer o prompt do modelo, digite `Oi, Pixel!` para confirmar e depois `/bye`. O Ollama deve continuar rodando em segundo plano. API local: http://127.0.0.1:11434.

## 2. Instalar TikFinity

Baixe em https://tikfinity.com/pt/ e instale o aplicativo Desktop. Faça a configuração e conecte a LIVE pelo @ público. A Event API local só fica disponível com o aplicativo Desktop aberto. Endpoint documentado: `ws://localhost:21213/`.

## 3. Instalar a ponte

Na pasta principal do projeto, rode:

```cmd
npm install ws
node local-ai/bridge.mjs
```

Abra http://127.0.0.1:3031 e mantenha a página aberta. O painel recebe comentários pelo TikFinity e envia a solicitação ao Ollama local. O script aplica limite de 1 resposta global a cada 4,5 segundos e 25 segundos por usuário.

## 4. Voz e boca do avatar

A página usa SpeechSynthesis do navegador com uma voz pt-BR instalada no Windows. Em Configurações > Hora e idioma > Idioma e região > Português (Brasil) > Opções de idioma, instale uma voz de conversão de texto em fala que tenha suporte offline, se disponível. A lista exibida no painel depende das vozes instaladas no Windows.

Para a boca do VSeeFace acompanhar a voz:
1. Instale VB-CABLE: https://vb-audio.com/Cable/ (opcional, gratuito para uso básico).
2. Nas configurações de áudio do Windows/navegador, encaminhe a saída da página Pixel para **CABLE Input**.
3. No VSeeFace, selecione **CABLE Output** como microfone e habilite microphone lipsync.
4. No OBS, capture o áudio de **CABLE Input** (ou configure monitoramento apropriado) para o público ouvir a fala. Evite capturar duas vezes para não gerar eco.

Se não usar cabo virtual, a personagem pode falar pelo alto-falante, mas o VSeeFace talvez não receba o áudio para mover a boca. Use fones para evitar eco.

## 5. Avatar anime VRM

VSeeFace requer avatar VRM 0.x; não aceita VRM 1.0. Importe um modelo VRM 0.x com blendshapes de boca A/I/U/E/O. Use modelo licenciado para transmissão. Comece com textura 1K, sem acessórios/efeitos excessivos. No VSeeFace, use Recommend Settings e limite a 30 FPS. Fonte OBS: captura de jogo/janela do VSeeFace ou Spout2, com fundo transparente.

## 6. OBS

- Comece em 1280x720, 30 FPS.
- Capture VSeeFace como fonte de jogo/janela.
- Adicione áudio do CABLE Input uma única vez.
- Faça uma transmissão privada/teste antes de abrir para o público.

## Privacidade e limitações

- O modelo de linguagem roda localmente via Ollama depois do download.
- A síntese de voz é local apenas se a voz pt-BR instalada for offline.
- TikFinity é serviço de terceiros e recebe a conexão da LIVE; a ponte só lê comentários.
- O formato do payload TikFinity pode variar por versão; se os nomes de usuário/comentário não forem reconhecidos, será necessário ajustar o mapeamento com um exemplo real de evento.
- Esta ponte não envia mensagens escritas ao chat, apenas fala as respostas.
- IA local 0.5B pode interpretar mal perguntas, repetir respostas ou responder de forma simples. Não é garantido que responda a todos os comentários.
