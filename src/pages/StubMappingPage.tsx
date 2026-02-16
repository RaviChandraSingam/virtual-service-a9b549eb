import { useState } from "react";
import { useServiceStore } from "@/store/serviceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Layers } from "lucide-react";
import { StubMapping, HttpMethod } from "@/types/virtualService";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export default function StubMappingPage() {
  const store = useServiceStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(store.services[0]?.id || "");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [path, setPath] = useState("");
  const [status, setStatus] = useState("200");
  const [responseBody, setResponseBody] = useState("");

  const filteredStubs = selectedService ? store.getServiceStubs(selectedService) : store.stubs;

  const handleAdd = () => {
    const stub: StubMapping = {
      id: crypto.randomUUID(),
      serviceId: selectedService,
      requestMethod: method,
      requestPath: path,
      requestHeaders: {},
      responseStatus: parseInt(status),
      responseBody,
      responseHeaders: { "Content-Type": "application/json" },
    };
    store.addStub(stub);
    setDialogOpen(false);
    setPath("");
    setResponseBody("");
  };

  const methodColor = (m: string) => {
    switch (m) {
      case "GET": return "text-success";
      case "POST": return "text-warning";
      case "PUT": return "text-info";
      case "DELETE": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Stub Mapping</h1>
          <p className="text-sm text-muted-foreground mt-1">Define request patterns and response templates</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button onClick={() => setDialogOpen(true)} disabled={!selectedService} className="glow-primary">
            <Plus className="w-4 h-4 mr-2" /> Add Stub
          </Button>
        </div>
      </div>

      {filteredStubs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No stubs yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {store.services.length === 0 ? "Create a service first, then add stub mappings." : "Add request/response stub mappings for your service."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Method</TableHead>
                <TableHead className="text-muted-foreground">Request Path</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Response Preview</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStubs.map((stub) => (
                <TableRow key={stub.id} className="border-border">
                  <TableCell>
                    <span className={`font-mono font-semibold text-sm ${methodColor(stub.requestMethod)}`}>
                      {stub.requestMethod}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground">{stub.requestPath}</TableCell>
                  <TableCell>
                    <Badge variant={stub.responseStatus < 300 ? "default" : stub.responseStatus < 400 ? "secondary" : "destructive"} className="font-mono">
                      {stub.responseStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground font-mono">
                    {stub.responseBody.slice(0, 60)}{stub.responseBody.length > 60 ? "..." : ""}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => store.deleteStub(stub.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Stub Mapping</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Method</Label>
                <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
                  <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HTTP_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Request Path</Label>
                <Input placeholder="/orders/123" value={path} onChange={(e) => setPath(e.target.value)} className="bg-secondary font-mono text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Status Code</Label>
              <Input placeholder="200" value={status} onChange={(e) => setStatus(e.target.value)} className="bg-secondary font-mono text-sm w-24" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Response Body</Label>
              <Textarea
                placeholder='{ "id": 123, "status": "shipped" }'
                value={responseBody}
                onChange={(e) => setResponseBody(e.target.value)}
                className="bg-secondary font-mono text-sm min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!path.trim()} className="glow-primary">Add Stub</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
