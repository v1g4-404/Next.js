"use client"

import { useState } from "react";

type FormProps = {
  name: string,
  email: string,
  message: string
}

type ErrorsProps = Record<keyof FormProps, string>;

export default function Contact() {

  const [form, setForm] = useState<FormProps>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ErrorsProps>({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormProps
    setForm((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      message: ""
    });
    setErrors({
      name: "",
      email: "",
      message: ""
    });
  }

  const validate = () => {
    const newErrors: ErrorsProps = {
      name: "",
      email: "",
      message: ""
    };

    if (!form.name.trim()) {
      newErrors.name = "お名前は必須です。"
    } else if (form.name.length > 30) {
      newErrors.name = "お名前は30文字以内で入力してください。"
    }
    if (!form.email.trim()) {
      newErrors.email = "メールアドレスは必須です。"
    }
    if (!form.message.trim()) {
      newErrors.message = "本文は必須です。"
    } else if (form.message.length > 500) {
      newErrors.message = "本文は500文字以内で入力してください。"
    }

    setErrors(newErrors);

    const hasError =
      newErrors.name !== "" || newErrors.email !== "" || newErrors.message !== "";

    return !hasError;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validate();

    if (!isValid) {
      return
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      alert("送信しました");
      const result = await res.json();
      console.log("response:", result);
      resetForm();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }

  }

  return (

    <>
      <div className="max-w-[800px] mx-auto py-10">
        <h1 className="text-xl font-bold mb-10">問合わせフォーム</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="name" className="w-60">お名前</label>
            <div className="w-full">
              <input disabled={isSubmitting} onChange={handleForm} value={form.name} name="name" type="text" id="name" className="border border-gray-300 rounded-lg p-4 w-full" />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="email" className="w-60">メールアドレス</label>
            <div className="w-full">
              <input disabled={isSubmitting} onChange={handleForm} value={form.email} name="email" type="email" id="email" className="border border-gray-300 rounded-lg p-4 w-full" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="message" className="w-60">本文</label>
            <div className="w-full">
              <textarea disabled={isSubmitting} onChange={handleForm} value={form.message} name="message" id="message" rows={8} className="border border-gray-300 rounded-lg p-4 w-full" />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button disabled={isSubmitting} type="submit" className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4">送信</button>
            <button type="reset" onClick={resetForm} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">クリア</button>
          </div>
        </form>
      </div>
    </>
  )
}