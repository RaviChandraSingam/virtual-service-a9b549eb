import { useState } from "react";
import { useServiceStore } from "@/store/serviceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, FileCode, Copy, Search } from "lucide-react";
import { DroolsRule } from "@/types/virtualService";

const TEMPLATE_RULES = [
  {
    name: "Header Match",
    tags: ["HTTP"],
    drools: `rule "Header Match"
    salience 10
    when
        Request(headers["X-Custom"] == "value")
    then
        Response(status = 200, body = "Header matched");
end`,
  },
  {
    name: "Payload Contains",
    tags: ["JSON"],
    drools: `rule "Payload Contains"
    salience 5
    when
        Request(body contains "orderId")
    then
        Response(status = 200, body = '{"matched": true}');
end`,
  },
  {
    name: "Method + Path Match",
    tags: ["HTTP"],
    drools: `rule "Method Path Match"
    salience 8
    when
        Request(method == "POST", path matches "/api/.*")
    then
        Response(status = 201, body = '{"created": true}');
end`,
  },
  {
    name: "Response Override",
    tags: ["Custom"],
    drools: `rule "Response Override"
    salience 15
    when
        Request(method == "GET")
    then
        Response(status = 200, body = "Overridden response");
end`,
  },
];

export default function RuleEditorPage() {
  const store = useServiceStore();
  const [selectedService, setSelectedService] = useState(store.services[0]?.id || "");
  const [editorContent, setEditorContent] = useState("");
  const [ruleName, setRuleName] = useState("");
  const [salience, setSalience] = useState("10");
  const [search, setSearch] = useState("");

  const serviceRules = selectedService ? store.getServiceRules(selectedService) : [];

  const handleSaveRule = () => {
    if (!ruleName.trim() || !editorContent.trim() || !selectedService) return;
    const rule: DroolsRule = {
      id: crypto.randomUUID(),
      serviceId: selectedService,
      name: ruleName,
      salience: parseInt(salience) || 10,
      condition: "",
      action: "",
      rawDrools: editorContent,
      enabled: true,
      tags: [],
      version: 1,
    };
    store.addRule(rule);
    setRuleName("");
    setEditorContent("");
  };

  const filteredTemplates = TEMPLATE_RULES.filter(
    (t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Rule Editor</h1>
          <p className="text-sm text-muted-foreground mt-1">Author and manage Drools rules for your services</p>
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

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <Tabs defaultValue="editor">
            <TabsList className="bg-secondary">
              <TabsTrigger value="editor">Text Editor</TabsTrigger>
              <TabsTrigger value="rules">Saved Rules ({serviceRules.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4 mt-4">
              <div className="grid grid-cols-[1fr_100px] gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Rule Name</Label>
                  <Input value={ruleName} onChange={(e) => setRuleName(e.target.value)} placeholder="VIP Customer Rule" className="bg-secondary" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Salience</Label>
                  <Input value={salience} onChange={(e) => setSalience(e.target.value)} placeholder="10" className="bg-secondary font-mono" />
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Drools Rule Definition</Label>
                <Textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder={`rule "My Rule"\n    salience 10\n    when\n        Request(method == "GET")\n    then\n        Response(status = 200, body = "matched");\nend`}
                  className="bg-muted font-mono text-sm min-h-[300px] leading-relaxed border-primary/20 focus:border-primary/50"
                  spellCheck={false}
                />
              </div>

              <Button onClick={handleSaveRule} disabled={!ruleName.trim() || !editorContent.trim() || !selectedService} className="glow-primary">
                Save Rule
              </Button>
            </TabsContent>

            <TabsContent value="rules" className="mt-4">
              {serviceRules.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No rules created yet for this service.
                </div>
              ) : (
                <div className="space-y-3">
                  {serviceRules.sort((a, b) => b.salience - a.salience).map((rule) => (
                    <div key={rule.id} className="rounded-lg border border-border bg-surface-2 p-4 animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm text-foreground">{rule.name}</span>
                          <Badge variant="outline" className="text-xs font-mono">salience: {rule.salience}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(v) => store.updateRule({ ...rule, enabled: v })}
                          />
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => store.deleteRule(rule.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <pre className="text-xs text-muted-foreground font-mono bg-muted rounded p-3 overflow-x-auto">
                        {rule.rawDrools}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Rule Library */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Reusable Rule Library</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rules..."
                className="bg-secondary pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredTemplates.map((tmpl, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface-2 p-3 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{tmpl.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary"
                    onClick={() => {
                      setEditorContent(tmpl.drools);
                      setRuleName(tmpl.name);
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Use
                  </Button>
                </div>
                <div className="flex gap-1">
                  {tmpl.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
