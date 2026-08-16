import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-blue-600 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">Shop Smarter,<br />Live Better</h1>
        <p className="mb-8 max-w-xl text-lg sm:text-xl">Discover quality products at straightforward prices.</p>
        <Link to="/products" className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-gray-100">Shop now</Link>
      </div>
    </section>
  );
}

export default Hero;