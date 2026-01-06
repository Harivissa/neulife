import { motion, useReducedMotion, type Easing } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Users } from 'lucide-react';
import neulifeLogo from '@/assets/neulife-logo.png';

const Landing = () => {
  const shouldReduceMotion = useReducedMotion();

  const easeOut: Easing = 'easeOut';
  const easeInOut: Easing = 'easeInOut';

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: shouldReduceMotion ? 0 : 0.7, ease: easeOut }
  };

  const logoEntrance = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: easeOut }
  };

  const breathingAnimation = shouldReduceMotion
    ? {}
    : {
        animate: {
          scale: [1, 1.03, 1],
          transition: {
            duration: 3.5,
            ease: easeInOut,
            repeat: Infinity
          }
        }
      };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.img
            src={neulifeLogo}
            alt="NeuLife"
            className="h-10 object-contain"
            {...logoEntrance}
          />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#vision" className="text-muted-foreground hover:text-foreground transition-colors">
              Vision
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </nav>
          <Link to="/auth" className="md:hidden">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            className="mb-12 flex justify-center"
            {...logoEntrance}
            {...breathingAnimation}
          >
            <img
              src={neulifeLogo}
              alt="NeuLife"
              className="h-24 md:h-32 object-contain"
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
            {...fadeInUp}
          >
            Your Health, <span className="text-teal-600">Reimagined</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: easeOut, delay: 0.1 }}
          >
            NeuLife combines smart health scanning and AI-driven analysis to help you 
            understand your health early and take the right next step.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: easeOut, delay: 0.2 }}
          >
            <Link to="/app">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-teal-600/20">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#vision">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full border-2">
                Learn More
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-24 px-6 bg-gradient-to-b from-background to-teal-50/30 dark:to-teal-950/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Vision
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Bridging technology and healthcare to make early health insights accessible to everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Early Detection',
                description: 'Understand your health signals before they become serious concerns.'
              },
              {
                icon: Shield,
                title: 'Trusted Analysis',
                description: 'AI-powered insights backed by medical knowledge and research.'
              },
              {
                icon: Users,
                title: 'For Everyone',
                description: 'Simple, accessible health guidance for all ages and backgrounds.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: easeOut, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About NeuLife
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              NeuLife is a first-level digital healthcare assistant designed to help users 
              understand their health early, clearly, and responsibly. We don't replace doctors — 
              we support early decision-making and help you take informed next steps.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Built by a Future Engineer and Future Doctor, NeuLife represents a vision 
              where technology and medicine work together to make healthcare more accessible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-teal-100 text-lg mb-10 max-w-2xl mx-auto">
              Start your smart health journey today. Get personalized insights 
              and guidance in minutes.
            </p>
            <Link to="/app">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 px-10 py-6 text-lg rounded-full shadow-xl">
                Start Your Health Check
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-background border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img
              src={neulifeLogo}
              alt="NeuLife"
              className="h-8 object-contain"
            />
            <p className="text-muted-foreground text-sm text-center">
              Developed by Future Engineer: Hari Vissa & Future Doctor: Michelle Manda
            </p>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} NeuLife
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
