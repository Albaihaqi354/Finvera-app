import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-light font-ibm dark:bg-brand-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-brand-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-brand-black dark:text-base-light">
            Finvera App
          </h1>
          <p className="max-w-md text-lg leading-8 text-base-gray-1 dark:text-base-gray-2">
            Selamat datang di Finvera. Aplikasi finansial premium dengan desain modern.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-black text-brand-primary px-5 transition-colors hover:bg-base-gray-1 dark:bg-brand-primary dark:text-brand-black md:w-[158px]"
            href="#"
          >
            Mulai Sekarang
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-base-gray-1 px-5 transition-colors hover:border-transparent hover:bg-brand-primary dark:border-base-gray-2 dark:hover:bg-brand-black md:w-[158px]"
            href="#"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </main>
    </div>
  );
}
