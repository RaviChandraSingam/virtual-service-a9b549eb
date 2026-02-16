import { useState } from "react";
import { useServiceStore } from "@/store/serviceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, FlaskConical, Plus, Trash2 } from "lucide-react";
import { HttpMethod, TestResult } from "@/types/virtualService";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface HeaderPair {
  key: string;
  value: string;
}

export default function TestingPage() {
  const store = useServiceStore();
  const [selectedService, setSelectedService] = useState(store.services[0]?.id || "");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [path, setPath] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState<HeaderPair[]>([{ key: "", value: "" }]);
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const simulate = () => {
    if (!selectedService || !path.trim()) return;
    setLoading(true);

    // Simulated rule matching
    setTimeout(() => {
      const serviceStubs = store.getServiceStubs(selectedService);
      const serviceRules = store.getServiceRules(selectedService).filter((r) => r.enabled).sort((a, b) => b.salience - a.salience);

      const matchedStub = serviceStubs.find((s) => s.requestMethod === method && s.requestPath === path);
      const firedRules: string[] = [];
      const logs: string[] = [];

      logs.push(`[INFO] Evaluating request: ${method} ${path}`);

      // Check rules
      const headerMap: Record<string, string> = {};
      headers.forEach((h) => { if (h.key) headerMap[h.key] = h.value; });

      serviceRules.forEach((rule) => {
        // Simple simulation: check if rule drools mentions the method
        if (rule.rawDrools.includes(`method == "${method}"`)) {
          firedRules.push(rule.name);
          logs.push(`[RULE] "${rule.name}" (salience: ${rule.salience}) — FIRED`);
        } else {
          logs.push(`[RULE] "${rule.name}" (salience: ${rule.salience}) — not matched`);
        }
      });

      let responseBody = "";
      let responseStatus = 200;

      if (firedRules.length > 0) {
        logs.push(`[INFO] ${firedRules.length} rule(s) fired`);
        responseBody = JSON.stringify({ matched: true, rules: firedRules }, null, 2);
      } else if (matchedStub) {
        logs.push(`[STUB] Matched stub for ${method} ${path}`);
        responseBody = matchedStub.responseBody;
        responseStatus = matchedStub.responseStatus;
      } else {
        logs.push(`[WARN] No stub or rule matched`);
        responseBody = JSON.stringify({ error: "No matching stub or rule found" }, null, 2);
        responseStatus = 404;
      }

      setResult({
        status: responseStatus,
        body: responseBody,
        headers: { "Content-Type": "application/json" },
        rulesFired: firedRules,
        executionTime: Math.floor(Math.random() * 50) + 5,
        logs,
      });
      setLoading(false);
    }, 500);
  };

  const statusColor = (s: number) => {
    if (s < 300) return "bg-success text-success-foreground";
    if (s < 400) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Testing Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">Simulate requests and inspect rule execution</p>
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

      <div className="grid grid-cols-2 gap-6">
        {/* Request */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Request</h3>

          <div className="flex gap-2">
            <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
              <SelectTrigger className="w-28 bg-secondary font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/orders/123"
              className="flex-1 bg-secondary font-mono text-sm"
            />
            <Button onClick={simulate} disabled={!selectedService || !path.trim() || loading} className="glow-primary">
              <Play className="w-4 h-4 mr-1" /> Send
            </Button>
          </div>

          {/* Headers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Headers</Label>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-primary" onClick={() => setHeaders((h) => [...h, { key: "", value: "" }])}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            {headers.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input placeholder="Key" value={h.key} onChange={(e) => { const next = [...headers]; next[i] = { ...next[i], key: e.target.value }; setHeaders(next); }} className="flex-1 h-8 bg-secondary text-sm" />
                <Input placeholder="Value" value={h.value} onChange={(e) => { const next = [...headers]; next[i] = { ...next[i], value: e.target.value }; setHeaders(next); }} className="flex-1 h-8 bg-secondary text-sm" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground" onClick={() => setHeaders(headers.filter((_, j) => j !== i))}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Body */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Body</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="{}" className="bg-secondary font-mono text-sm min-h-[120px]" spellCheck={false} />
          </div>
        </div>

        {/* Response */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Response</h3>

          {!result ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <FlaskConical className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Send a request to see results</p>
            </div>
          ) : (
            <Tabs defaultValue="response">
              <TabsList className="bg-secondary">
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="rules">Rules ({result.rulesFired.length})</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="response" className="mt-3">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`font-mono ${statusColor(result.status)}`}>{result.status}</Badge>
                  <span className="text-xs text-muted-foreground">{result.executionTime}ms</span>
                </div>
                <pre className="rounded-lg bg-muted p-4 text-sm font-mono text-foreground overflow-auto max-h-[400px]">
                  {result.body}
                </pre>
              </TabsContent>

              <TabsContent value="rules" className="mt-3 space-y-2">
                {result.rulesFired.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No rules fired</p>
                ) : (
                  result.rulesFired.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-success/10 border border-success/20 px-3 py-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm text-foreground">{name}</span>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="logs" className="mt-3">
                <pre className="rounded-lg bg-muted p-4 text-xs font-mono text-muted-foreground overflow-auto max-h-[400px] leading-relaxed">
                  {result.logs.join("\n")}
                </pre>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
