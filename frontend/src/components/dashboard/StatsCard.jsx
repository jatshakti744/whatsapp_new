import { cn } from "@/lib/utils";

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon: Icon,
  iconColor = "bg-primary"
}) => {
  return (
    <div className="group relative bg-card rounded-2xl p-6 shadow-soft card-hover overflow-hidden border border-border/50">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2 tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              {changeType === "positive" && (
                <span className="text-success text-xs">↑</span>
              )}
              {changeType === "negative" && (
                <span className="text-destructive text-xs">↓</span>
              )}
              <p className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}>
                {change}
              </p>
            </div>
          )}
        </div>
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-medium transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow",
          iconColor
        )}>
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

