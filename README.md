# NFT Collection Using AI

## Requirements
1. Starton API Key
2. OpenAI API Key
3. Nodejs installed

## Steps
1. Create a .env file in the backend directory with the following format:

    API_HOST=localhost

    API_PORT=8000
   
    STARTON_API_URL=https://api.starton.com/v3

    STARTON_API_KEY= your_starton_api_key

    STARTON_SIGNER_WALLET= your_starton_wallet_address

    OPEN_AI_API_KEY= your_openai_api_key

2. Create a .env file in the frontend directory with the following format:

    NEXT_PUBLIC_BACK_URL=http://localhost:8000

3. Go to backend directory and run yarn install & yarn dev (if yarn is not installed -> npm install -g yarn)

4. Go to frontend directory and run yarn install & yarn dev

5. Open http://localhost:3000 to access on the browser
