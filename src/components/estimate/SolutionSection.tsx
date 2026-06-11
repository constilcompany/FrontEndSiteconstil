import heroImage from "@/assets/images/banner1.jpg";


const SolutionSection = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-8">
        {/* LEFT: Text content */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
            Win more profitable work
          </p>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Protect margins with
            <br />
            smarter estimating
          </h2>

          <p className="mb-6 text-sm leading-relaxed text-slate-700 md:text-base">
            Profitable projects start with accurate estimating. By reducing
            rework and streamlining takeoff, teams can lock in costs, safeguard
            margins, and pursue the right opportunities.
          </p>

          <ul className="mb-8 space-y-3 text-sm leading-relaxed text-slate-800">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-900" />
              <span>
                Extract quantities from 2D or 3D models with auto-mapped takeoff.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-900" />
              <span>
                Use AI to detect floor plan areas and auto-count repeated
                symbols—reduce costly rework by aligning scope and cost from the
                start.
              </span>
            </li>
          </ul>

          <button
            type="button"
            className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
           Get Started Now
            <span className="ml-1 text-lg leading-none">→</span>
          </button>
        </div>

        {/* RIGHT: Screenshot / app preview */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl rounded-xl bg-white shadow-[0_20px_45px_rgba(15,23,42,0.16)]">
            <img
              src={heroImage} // apni image ka path yahan lagao
              alt="Estimating software interface"

              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;