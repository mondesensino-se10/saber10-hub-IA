export const config = {
  runtime: 'edge', // Força a Vercel a usar o motor de borda ultra rápido e sem bugs de formato
};

export default async function handler(request) {
    // Configura os cabeçalhos de liberação de segurança (CORS)
    const headers = {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    try {
        // Lê os dados direto do chat no padrão Edge (limpo e sem erro 500)
        const body = await request.json();

        const openRouterResponse = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await openRouterResponse.json();
        return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (error) {
        return new Response(JSON.stringify({ error: { message: "Erro no processamento seguro dos dados." } }), { status: 500, headers });
    }
}
