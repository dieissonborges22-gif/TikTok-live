# Pixel LIVE AI — Anime Edition (8 GB RAM)

Leia o guia completo em [local-ai/README.md](local-ai/README.md).

**Arquitetura:** TikFinity Desktop Event API -> ponte Node.js local -> Ollama `qwen2.5:0.5b` em CPU -> voz pt-BR offline do Windows/browser -> VB-CABLE -> VSeeFace lipsync -> OBS.

## Início rápido
1. Instale Ollama e baixe o modelo: `ollama pull qwen2.5:0.5b`.
2. Instale TikFinity Desktop e conecte sua LIVE.
3. Execute `INICIAR_IA_LOCAL.bat`.
4. Abra http://127.0.0.1:3031.
5. Configure áudio virtual e VSeeFace conforme o guia.

O modelo só precisa de internet no download inicial. A LIVE continua exigindo internet. A configuração foi dimensionada conservadoramente para 8 GB, mas a velocidade depende do processador, ainda não identificado.
