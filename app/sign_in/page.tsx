"use client"

export default function SignIn() {
  return (
    <>
      <div className="flex justify-center pt-60">
        <form action="" className="space-y-4 w-full max-w-sm">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">メールアドレス</label>
            <input id="email" className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@company.com" required type="email" name="email"></input>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">パスワード</label>
            <input id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required type="password" name="password"></input>
          </div>
          <div>
            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">ログイン</button>
          </div>
        </form>
      </div>
    </>
  )
}