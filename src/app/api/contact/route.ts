interface TurnstileVerificationResponse {
    success: boolean;
    error_codes?: string[];
    challenge_ts?: string;
    hostname?: string;
}

interface RequestBody extends FormData {
    turnstileToken: string;
}

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { turnstileToken, ...formData } = body;

        // 验证 Turnstile token
        const verificationResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                }),
            }
        );

        const verificationData: TurnstileVerificationResponse = await verificationResponse.json();

        if (!verificationData.success) {
            console.error('Turnstile verification failed:', verificationData['error_codes']);
            return Response.json(
                { error: '验证码验证失败' },
                { status: 400 }
            );
        }

        // 验证通过，处理表单数据
        // 这里添加你的业务逻辑，比如发送邮件或保存到数据库
        console.log(formData)

        return Response.json({ message: '提交成功' });
    } catch (error) {
        console.error('API route error:', error);
        return Response.json(
            { error: '服务器错误' },
            { status: 500 }
        );
    }
}
