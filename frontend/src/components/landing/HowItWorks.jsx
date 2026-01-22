import { MessageCircle, UserPlus, MessagesSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Client Sends Message",
    description: "A client messages your company's WhatsApp number. The message arrives in your system instantly."
  },
  {
    icon: UserPlus,
    step: "02", 
    title: "Admin Assigns Client",
    description: "New clients appear in Admin's unassigned inbox. Admin assigns them to the appropriate team member."
  },
  {
    icon: MessagesSquare,
    step: "03",
    title: "Member Responds",
    description: "The assigned member sees the client in their inbox and can chat directly. All from your single WhatsApp number."
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Full Visibility",
    description: "Admin can monitor all conversations, step in when needed, and transfer clients between members anytime."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple yet powerful workflow designed for teams managing hundreds of client conversations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block" />

            <div className="space-y-8">
              {steps.map((item, index) => (
                <div 
                  key={index}
                  className="relative flex items-start gap-6 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Step indicator */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                      <item.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-primary">{item.step}</span>
                      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

