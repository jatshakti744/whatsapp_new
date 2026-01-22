import { 
  MessageSquare, 
  Users, 
  UserCog, 
  Bell, 
  Shield, 
  BarChart3,
  ArrowLeftRight,
  Clock
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description: "All WhatsApp messages flow into one centralized inbox. Never miss a client message again."
  },
  {
    icon: Users,
    title: "Multi-Agent Support",
    description: "Support 200+ team members with role-based access. Each member sees only their assigned clients."
  },
  {
    icon: UserCog,
    title: "Smart Assignment",
    description: "Admins can assign and transfer clients between members with full conversation history preserved."
  },
  {
    icon: ArrowLeftRight,
    title: "Seamless Handoffs",
    description: "Transfer conversations between team members without losing context or chat history."
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Instant alerts for new messages, assignments, and important updates across your team."
  },
  {
    icon: Shield,
    title: "Complete Audit Trail",
    description: "Full logging of all actions. Members cannot delete chats - everything is tracked."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track response times, message volumes, and team performance with detailed insights."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Keep your business running around the clock with team shift management."
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage{" "}
            <span className="text-primary">WhatsApp at Scale</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for businesses with large teams. Streamline your customer communication 
            with powerful features designed for enterprise use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl bg-card shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

