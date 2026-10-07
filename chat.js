export default async function handler(request, response) {
    // Configura as regras de permissão (CORS) para o seu próprio site ler a resposta
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Se for apenas um teste de conexão inicial (OPTIONS), aprova imediatamente
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // Puxa a chave secreta guardada com segurança no painel da Vercel
    const apiKey = process.env.OPENROUTER_API_KEY;

    try {
        const body = request.body;

        // Faz o envio blindado para os computadores do OpenRouter
        const openRouterResponse = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await openRouterResponse.json();
        return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json({ error: { message: "Erro interno no servidor seguro." } });
    }
}
