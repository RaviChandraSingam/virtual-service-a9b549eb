import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceForm } from "./ResourceForm";
import { VirtualService, ServiceType, ServiceResource } from "@/types/virtualService";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

function createResource(): ServiceResource {
  return {
    id: crypto.randomUUID(),
    urlPattern: "",
    method: "GET",
    proxyHost: "",
    recordingEnabled: false,
    skipStatusCodes: "",
    requestReplacements: [],
    responseReplacements: [],
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (service: VirtualService) => void;
}

export function CreateServiceDialog({ open, onOpenChange, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ServiceType>("REST");
  const [baseUrl, setBaseUrl] = useState("");
  const [port, setPort] = useState("8080");
  const [resources, setResources] = useState<ServiceResource[]>([createResource()]);

  const handleSubmit = () => {
    const service: VirtualService = {
      id: crypto.randomUUID(),
      name,
      type,
      baseUrl,
      port,
      resources,
      createdAt: new Date().toISOString(),
    };
    onSubmit(service);
    // reset
    setName("");
    setType("REST");
    setBaseUrl("");
    setPort("8080");
    setResources([createResource()]);
  };

  const updateResource = (index: number, r: ServiceResource) => {
    setResources((prev) => prev.map((x, i) => (i === index ? r : x)));
  };

  const removeResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid = name.trim() && baseUrl.trim() && resources.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Virtual Service</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-5 pb-4">
            {/* Service Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Service Name</Label>
                <Input
                  placeholder="OrderService"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as ServiceType)}>
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REST">REST</SelectItem>
                    <SelectItem value="SOAP">SOAP</SelectItem>
                    <SelectItem value="gRPC">gRPC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_120px] gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Base URL</Label>
                <Input
                  placeholder="http://localhost"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="bg-secondary font-mono text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Port</Label>
                <Input
                  placeholder="8080"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="bg-secondary font-mono text-sm"
                />
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-foreground">Resources</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResources((prev) => [...prev, createResource()])}
                  className="text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Resource
                </Button>
              </div>
              <div className="space-y-3">
                {resources.map((r, i) => (
                  <ResourceForm
                    key={r.id}
                    resource={r}
                    onChange={(updated) => updateResource(i, updated)}
                    onRemove={() => removeResource(i)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid} className="glow-primary">
            Create Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
