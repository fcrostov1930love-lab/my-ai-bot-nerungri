export async function handler(req, res) {
    // Разрешаем только безопасные POST-запросы
    if (req.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Метод запрещен' }) };
    }

    // На Netlify данные приходят в виде строки, превращаем их в объект
    const { prompt } = JSON.parse(req.body);

    try {
        // Отправляем запрос на наш открытый бесплатный шлюз ИИ
        const response = await fetch('https://vercel.app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error('Ошибка шлюза');
        }

        const data = await response.json();
        
        // Возвращаем ответ нашему сайту по стандартам Netlify
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.answer })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "❌ Система временно перегружена. Попробуй отправить еще раз через пару секунд!" })
        };
    }
}
