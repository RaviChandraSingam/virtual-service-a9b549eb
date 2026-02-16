import { useState } from "react";
import { useServiceStore } from "@/store/serviceStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, GripVertical, GitBranch } from "lucide-react";
import { DroolsRule } from "@/types/virtualService";

export default function RuleFlowPage() {
  const store = useServiceStore();
  const [selectedService, setSelectedService] = useState(store.services[0]?.id || "");

  const serviceRules = selectedService
    ? store.getServiceRules(selectedService).sort((a, b) => b.salience - a.salience)
    : [];

  const moveRule = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const current = serviceRules[index];
      const above = serviceRules[index - 1];
      store.updateRule({ ...current, salience: above.salience + 1 });
    } else if (direction === "down" && index < serviceRules.length - 1) {
      const current = serviceRules[index];
      const below = serviceRules[index + 1];
      store.updateRule({ ...current, salience: below.salience - 1 });
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Rule Sequencing</h1>
          <p className="text-sm text-muted-foreground mt-1">Define execution order using salience priority</p>
        </div>
        {store.services.length > 0 && (
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-48 bg-secondary">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {store.services.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {serviceRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <GitBranch className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No rules to sequence</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create rules in the Rule Editor first, then arrange their execution order here.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {serviceRules.map((rule, index) => (
            <div key={rule.id}>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors animate-fade-in">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />

                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-mono text-sm font-semibold shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{rule.name}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">salience: {rule.salience}</Badge>
                    {!rule.enabled && <Badge variant="secondary" className="text-[10px]">disabled</Badge>}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => moveRule(index, "up")}
                    className="h-7 w-7 p-0 text-muted-foreground"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={index === serviceRules.length - 1}
                    onClick={() => moveRule(index, "down")}
                    className="h-7 w-7 p-0 text-muted-foreground"
                  >
                    ↓
                  </Button>
                </div>
              </div>

              {index < serviceRules.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
