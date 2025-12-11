import { Link } from "wouter";
import { ArrowRight, Globe, BarChart3, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/abstract_modern_event_background_with_soft_purple_and_blue_gradients.png";
import networkingImage from "@assets/generated_images/abstract_representation_of_global_networking_and_digital_connections.png";
import analyticsImage from "@assets/generated_images/dashboard_analytics_visualization_with_charts_and_graphs.png";
import organizerImage from "@assets/generated_images/conference_stage_with_spotlight_and_audience_atmosphere.png";

export default function Landing() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden mb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Event Background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
        </div>
        
        <div className="container relative z-10 px-4 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm backdrop-blur-md bg-white/10 border-white/20 text-white shadow-lg">
              The Future of Event Management
            </Badge>
            <h1 className="text-6xl md:text-8xl font-heading font-bold text-white mb-8 tracking-tight drop-shadow-lg leading-tight">
              Connect. Learn.<br />Grow Together.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light">
              Join thousands of professionals at world-class conferences, workshops, and meetups tailored to your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold h-14 px-8 text-lg shadow-xl" asChild>
                <Link href="/events">Browse Events</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-14 px-8 text-lg backdrop-blur-sm" asChild>
                <Link href="/user-profile">Become an Organizer</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props / Features */}
      <section className="container mx-auto px-4 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold mb-4">Why EventHorizon?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide the tools you need to discover great events and manage them with ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border aspect-video w-full group-hover:scale-[1.02] transition-transform duration-500">
              <img src={networkingImage} alt="Global Networking" className="w-full h-full object-cover" />
            </div>
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Networking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect with professionals from around the world. Our platform breaks down geographical barriers.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border aspect-video w-full group-hover:scale-[1.02] transition-transform duration-500">
              <img src={analyticsImage} alt="Real-time Analytics" className="w-full h-full object-cover" />
            </div>
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              For organizers, get deep insights into your audience, ticket sales, and engagement in real-time.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border aspect-video w-full group-hover:scale-[1.02] transition-transform duration-500">
              <img src={organizerImage} alt="Seamless Management" className="w-full h-full object-cover" />
            </div>
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Seamless Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              From ticketing to check-in, manage every aspect of your event from a single, intuitive dashboard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA / Organizer Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to Host Your Own Event?</h2>
            <p className="text-primary-foreground/90 text-xl mb-10 leading-relaxed">
              Join our community of organizers and start creating unforgettable experiences today. It's free to get started.
            </p>
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold" asChild>
              <Link href="/user-profile">Start Organizing Now</Link>
            </Button>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-primary-foreground/80 font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Instant Payouts</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Custom Branding</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> 24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
