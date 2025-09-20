import { Button } from "../components/ui/button";
import heroImage from "../assets/hero-notes.jpg";
import { FileText, Search, Smartphone, Zap } from "lucide-react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 notes included",
      "Basic text formatting",
      "Search your notes",
      "Mobile & desktop access"
    ],
    cta: "Start Free",
    variant: "outline" ,
    popular: false
  },
  {
    name: "Pro",
    price: "$5",
    period: "per month",
    description: "For serious note-takers",
    features: [
      "Unlimited notes",
      "Advanced formatting",
      "File attachments",
      "Priority support",
      "Offline access",
      "Export options"
    ],
    cta: "Upgrade to Pro",
    variant: "hero",
    popular: true
  }
];


 const features = [
  {
    Icon: FileText,
    title: "Simple Note Taking",
    description: "Clean, distraction-free writing experience. Focus on what matters most."
  },
  {
    Icon: Search,
    title: "Instant Search",
    description: "Find any note in seconds with powerful search across all your content."
  },
  {
    Icon: Smartphone,
    title: "Works Everywhere",
    description: "Access your notes from any device. Always in sync, always available."
  },
  {
    Icon: Zap,
    title: "Lightning Fast",
    description: "No lag, no loading. Your thoughts flow as fast as you can type."
  }
];


const HomePage = () => {
  const navigate = useNavigate();
 

  return (
    <>
   <section className="bg-subtle-gradient py-50 lg:py-42 min-h-lvh">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Capture Ideas.
              <span className="text-blue-500"> Organize Life.</span>
            </h1>
            <p className="text-xl text-slate-900 mb-8 max-w-2xl">
              The simplest way to capture your thoughts, organize your ideas, and never forget what matters. 
              Start with 3 free notes, upgrade for unlimited creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={() => navigate("/notes")} variant="hero" size="lg" className="text-lg">
                Start Writing Free
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <img 
              src={heroImage} 
              alt="Notes app interface showing organized note cards"
              className="w-full h-auto rounded-lg shadow-card-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-hsl(220 15% 20%) mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you capture, organize, and find your ideas effortlessly.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="text-center p-6 rounded-lg hover:shadow-card transition-smooth group"
            >
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 group-hover:text-blue-200 transition-smooth">
                <feature.Icon />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section id="pricing" className="py-20 bg-subtle-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-slate-900 max-w-2xl mx-auto">
            Start free with 3 notes. Upgrade when you're ready for unlimited creativity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-lg p-8 ${
                plan.popular 
                  ? 'bg-card border-2 border-primary shadow-card-lg bg-white' 
                  : 'bg-card border border-border shadow-card bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-slate-900 px-4 py-2 mt-4 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                  <span className="text-muted-slate-800">/{plan.period}</span>
                </div>
                <p className="text-muted-slate-800">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check size={20} className="text-primary mr-3 flex-shrink-0" />
                    <span className="text-slate-800">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.variant}
                size="lg" 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
     <footer className="bg-white border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-blue-500 mb-4">NotesApp</h3>
            <p className="text-muted-slate-800">
              The simplest way to capture and organize your thoughts.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Features</a></li>
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Pricing</a></li>
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Help Center</a></li>
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Contact</a></li>
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Privacy</a></li>
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Terms</a></li>
              <li><a href="#" className="text-muted-slate-800 hover:text-slate-800 transition-smooth">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-slate-800">
            © 2024 NotesApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}

export default HomePage;