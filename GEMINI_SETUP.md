# Configurar a IA da Pixel Girl

## Requisitos
- Node.js 18 ou superior.
- Uma chave da Gemini API criada no Google AI Studio: https://aistudio.google.com/app/apikey

## Ativar a IA
1. Na pasta do projeto, copie `.env.example` e renomeie a cópia para `.env`.
2. Abra `.env` e substitua `cole_sua_chave_aqui` pela sua chave.
3. Salve. Não publique nem envie esse arquivo; ele está protegido pelo `.gitignore`.
4. No terminal, execute `npm install` e depois `npm start`.
5. Abra http://localhost:3000 e conecte sua LIVE.
6. Ative as duas opções: responder comentários e usar IA Gemini.

O modelo padrão é `gemini-3.5-flash-lite`. Pode ser alterado em `.env` se o Google mudar os modelos disponíveis para sua conta.

## Privacidade e limites
A chave fica somente no servidor local. Comentários selecionados para resposta são enviados à API Gemini. A API possui cotas e limites gratuitos que podem mudar; não há uso ilimitado garantido. O aplicativo limita a frequência de respostas para evitar spam e usa respostas locais se a API estiver indisponível.

## Voz
A fala continua usando as vozes instaladas/disponíveis no navegador. A IA cria o texto da resposta; não transforma automaticamente a voz do navegador em uma voz neural nova.

## TikTok
O conector de LIVE é comunitário e não oficial. Pode parar de funcionar quando o TikTok alterar seus sistemas. Use somente em transmissões e contas que você controla.
