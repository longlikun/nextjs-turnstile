'use client';
import { useState, FormEvent } from 'react';
import TurnstileWidget from './TurnstileWidget';

interface FormData {
  email: string;
  password: string;
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
    password: '',
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
        setFormData({ email: '', password: '' });
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
    <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
          邮箱
        </label>
        <div className="mt-2.5">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
           <div className="sm:col-span-2">
        <label htmlFor="password" className="block text-sm/6 font-semibold text-gray-900">
          密码
        </label>
        <div className="mt-2.5">
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
      

      {/* <div className="sm:col-span-2">
        <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
          信息
        </label>
        <div className="mt-2.5">
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            required
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            rows={4}
          />
        </div>
      </div> */}

      <div className="sm:col-span-2">
        <TurnstileWidget
          onVerify={setTurnstileToken}
          theme="light"
        />
      </div>

      {status.message && (
        <div className="sm:col-span-2">
          <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {status.message}
          </p>
        </div>
      )}
    </div>

    <div className="mt-10">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm ${
          isSubmitting
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        }`}
      >
        {isSubmitting ? '提交中...' : '提交'}
      </button>
    </div>
  </form>

    
  );
};

export default ContactForm;