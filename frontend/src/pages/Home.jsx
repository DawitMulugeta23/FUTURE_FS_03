import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  Coffee,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Coffee,
      title: "Authentic Ethiopian Coffee",
      description:
        "Enjoy rich, freshly brewed coffee prepared from quality local beans with care in every cup.",
    },
    {
      icon: Heart,
      title: "Freshly Made Pastries",
      description:
        "Our pastries and light bites are prepared daily for a warm, comforting café experience.",
    },
    {
      icon: Award,
      title: "Trusted Quality",
      description:
        "From ingredients to service, we focus on consistency, cleanliness, and delicious flavor.",
    },
    {
      icon: Truck,
      title: "Easy Ordering",
      description:
        "Browse the menu online, place your order in minutes, and enjoy fast pickup or delivery.",
    },
  ];

  const highlights = [
    { value: "Daily", label: "Fresh coffee & bakery" },
    { value: "Fast", label: "Pickup and delivery" },
    { value: "Warm", label: "Friendly local service" },
    { value: "20% Off", label: "First order welcome" },
  ];

  const steps = [
    {
      title: "Explore the menu",
      description:
        "Find your favorite coffee, pastry, meal, or cold drink from our carefully prepared selection.",
    },
    {
      title: "Place your order",
      description:
        "Order online in just a few clicks and choose the option that works best for your schedule.",
    },
    {
      title: "Enjoy every bite",
      description:
        "Pick it up fresh or have it delivered and enjoy a cozy café experience wherever you are.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-950">
      <section
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-amber-950/70" />

        <div className="relative container mx-auto flex min-h-screen items-center px-4 py-16">
          <div className="max-w-3xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <MapPin size={16} className="text-amber-300" />
              Proudly serving Debre Berhan with fresh food and coffee
            </div>

            <h1 className="mb-5 text-5xl font-bold leading-tight md:text-7xl">
              More than a café — <span className="text-amber-400">a warm local experience.</span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
              Welcome to <strong>Yesekela Café</strong>, where authentic Ethiopian coffee,
              handmade pastries, comforting meals, and quick service come together.
              Whether you are starting your day, meeting friends, or ordering from home,
              we make every visit simple, fresh, and memorable.
            </p>

            <div className="mb-10 flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3 text-lg font-bold text-black transition hover:bg-amber-400"
              >
                Explore Menu <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="rounded-full border-2 border-white px-8 py-3 text-lg font-bold text-white transition hover:bg-white hover:text-black"
              >
                Learn Our Story
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <p className="text-xl font-bold text-amber-300">{item.value}</p>
                  <p className="text-sm text-gray-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Why customers choose us
            </p>
            <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-300 md:text-4xl">
              A welcoming place for coffee, comfort, and convenience
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
              We are here to make your day easier with quality ingredients, a calm atmosphere,
              and an ordering experience that helps you enjoy your favorites without the wait.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-6 text-center shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800"
              >
                <div className="mb-4 inline-flex rounded-full bg-amber-100 p-3 dark:bg-amber-900/50">
                  <feature.icon className="text-amber-600 dark:text-amber-400" size={32} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 dark:bg-gray-950">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              What makes Yesekela special
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Designed for busy mornings, relaxed afternoons, and easy online orders
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Yesekela Café is built for people who value both flavor and convenience.
              From your first morning coffee to an evening snack, our team is focused on
              fast service, warm hospitality, and food that feels freshly made just for you.
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Fresh menu options prepared daily",
                "Comfortable experience for students, families, and professionals",
                "Quick ordering flow for pickup or delivery",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-amber-600 dark:text-amber-400" size={20} />
                  <p className="text-gray-700 dark:text-gray-200">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 p-6 shadow-xl dark:from-gray-900 dark:to-gray-800">
            <h3 className="mb-5 text-2xl font-bold text-amber-900 dark:text-amber-300">
              What you can expect today
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 dark:bg-black/20">
                <Clock3 className="text-amber-600 dark:text-amber-400" size={22} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Open every day</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Start your morning with a fresh brew and stop by again for a relaxing bite later.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 dark:bg-black/20">
                <UtensilsCrossed className="text-amber-600 dark:text-amber-400" size={22} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">More than coffee</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Enjoy pastries, meals, and drinks that fit breakfast, lunch, or a quick snack.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 dark:bg-black/20">
                <ShieldCheck className="text-amber-600 dark:text-amber-400" size={22} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Reliable service</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Count on quality preparation, clean packaging, and a smooth ordering process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Simple ordering flow
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Order in three easy steps
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-100 py-16 dark:bg-amber-950/60">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white px-6 py-10 shadow-xl dark:bg-gray-900">
            <div className="mb-4 flex justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={18} fill="currentColor" />
              ))}
            </div>

            <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-300">
              A local favorite for good reason
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Join students, families, and coffee lovers who choose Yesekela Café for its cozy atmosphere,
              dependable service, and menu full of satisfying everyday favorites.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 dark:bg-gray-800">
                <Users size={16} className="text-amber-600" /> Friendly team
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 dark:bg-gray-800">
                <Coffee size={16} className="text-amber-600" /> Freshly brewed
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 dark:bg-gray-800">
                <Truck size={16} className="text-amber-600" /> Quick service
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 dark:bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-300">
            Special welcome offer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-amber-800 dark:text-amber-100">
            Get <strong>20% off</strong> on your first order with code <strong>WELCOME20</strong>.
            It is the perfect time to discover your next favorite coffee or snack.
          </p>
          <Link
            to="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-600 px-8 py-3 font-bold text-white transition hover:bg-amber-700"
          >
            Order Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;