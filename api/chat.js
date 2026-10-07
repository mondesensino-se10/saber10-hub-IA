export default async function handler(request, response) {
    // Regras de liberação de segurança de rede (CORS)
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    try {
        // Correção do erro 500: Garante a leitura correta do texto vindo do chat
        let body = request.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

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
        console.error(error);
        return response.status(500).json({ error: { message: "Erro interno no processamento dos dados." } });
    }
}
