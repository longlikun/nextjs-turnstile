// app/contact/page.tsx

import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">联系我们</h1>
      <ContactForm />
    </div>
  );
}