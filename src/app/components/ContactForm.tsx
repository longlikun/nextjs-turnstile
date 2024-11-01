'use client';
import { useState, FormEvent } from 'react';
import TurnstileWidget from './TurnstileWidget';

interface FormData {
  email: string;
  message: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
}
// 添加状态类型
type StatusType = 'success' | 'error' | '';

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    message: '',
  });
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [status, setStatus] = useState<{ type: StatusType; message: string }>({
    type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!turnstileToken) {
      setStatus({ type: 'error', message: '请完成人机验证' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: '提交成功！' });
        setFormData({ email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: `错误: ${data.error || '未知错误'}` });
      }
    } catch (error) {
      setStatus({ type: 'error', message: '提交失败，请重试' });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          邮箱:
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          消息:
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <TurnstileWidget
        onVerify={setTurnstileToken}
        theme="light"
      />

 
      {status && (
        <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
        {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 rounded-md text-white ${isSubmitting
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
          }`}
      >
        {isSubmitting ? '提交中...' : '提交'}
      </button>
    </form>
  );
};

export default ContactForm;