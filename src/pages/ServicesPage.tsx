import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useServiceStore } from "@/store/serviceStore";
import { CreateServiceDialog } from "@/components/services/CreateServiceDialog";
import { VirtualService } from "@/types/virtualService";
import { Plus, Server, Trash2, Globe, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ServicesPage() {
  const store = useServiceStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = (service: VirtualService) => {
    store.addService(service);
    setDialogOpen(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Virtual Services</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage your virtual service definitions</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="glow-primary">
          <Plus className="w-4 h-4 mr-2" /> Create New Virtual Service
        </Button>
      </div>

      {store.services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Server className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No services yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create your first virtual service to start defining endpoints, stub mappings, and rules.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {store.services.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors animate-fade-in"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    {s.type === "REST" ? <Globe className="w-5 h-5 text-primary" /> :
                     s.type === "gRPC" ? <Wifi className="w-5 h-5 text-primary" /> :
                     <Server className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono mt-0.5">
                      {s.baseUrl}:{s.port}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">{s.type}</Badge>
                      <Badge variant="outline" className="text-xs">{s.resources.length} resource{s.resources.length !== 1 ? "s" : ""}</Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => store.deleteService(s.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateServiceDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
    </div>
  );
}
