import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)'
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              <span className="block">3D Building</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Model Generator
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto">
              Create, customize, and visualize 3D building models in your browser.
              Configure floors, rooms, materials, and more with our interactive builder.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/create"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  Start Building →
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  >
                    Get Started Free →
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏗️',
                title: 'Procedural Generation',
                desc: 'Generate detailed 3D buildings with configurable floors, rooms, windows, doors, and roof types.',
              },
              {
                icon: '🎨',
                title: 'Material & Color',
                desc: 'Choose from concrete, brick, glass, steel, and wood materials with customizable colors.',
              },
              {
                icon: '👁️',
                title: 'Interactive 3D Viewer',
                desc: 'Rotate, zoom, and pan your models with full orbit controls and real-time rendering.',
              },
              {
                icon: '💾',
                title: 'Save & Manage',
                desc: 'Save your models, edit parameters, duplicate designs, and manage your building library.',
              },
              {
                icon: '📦',
                title: 'Export Models',
                desc: 'Export your 3D models as GLTF or GLB files for use in other applications.',
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'JWT authentication ensures your models and data are securely stored and private.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Start creating amazing 3D building models today. No downloads required.
          </p>
          <Link
            to={isAuthenticated ? '/create' : '/register'}
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition shadow-lg"
          >
            {isAuthenticated ? 'Create a Model' : 'Sign Up Free'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 3D Building Model Generator. Built with React, Three.js & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
