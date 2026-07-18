import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-jet text-white">
      <div className="wrap py-20 text-center">
        <p className="eyebrow">404</p>
        <h1 className="h-display mt-3 text-4xl text-white sm:text-5xl">
          Page Not Found
        </h1>
        <span className="red-rule mx-auto mt-6" />
        <p className="mx-auto mt-5 max-w-md text-sm text-silver">
          The page you&rsquo;re looking for doesn&rsquo;t exist. Head back to
          the homepage or contact us directly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/" className="btn-red">
            Back to Home
          </Link>
          <Link href="/contact" className="btn-ghost-light">
            Contact IAS
          </Link>
        </div>
      </div>
    </section>
  );
}
