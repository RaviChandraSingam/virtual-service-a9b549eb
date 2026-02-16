import { ServiceResource, HttpMethod, ReplacementPair } from "@/types/virtualService";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];

interface ResourceFormProps {
  resource: ServiceResource;
  onChange: (r: ServiceResource) => void;
  onRemove: () => void;
  index: number;
}

function ReplacementList({
  label,
  pairs,
  onChange,
}: {
  label: string;
  pairs: ReplacementPair[];
  onChange: (p: ReplacementPair[]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-primary"
          onClick={() => onChange([...pairs, { key: "", value: "" }])}
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      {pairs.map((p, i) => (
        <div key={i} className="flex gap-2">
          <Input
            placeholder="Key"
            value={p.key}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...next[i], key: e.target.value };
              onChange(next);
            }}
            className="flex-1 h-8 text-sm bg-secondary"
          />
          <Input
            placeholder="Value"
            value={p.value}
            onChange={(e) => {
              const next = [...pairs];
              next[i] = { ...next[i], value: e.target.value };
              onChange(next);
            }}
            className="flex-1 h-8 text-sm bg-secondary"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => onChange(pairs.filter((_, j) => j !== i))}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export function ResourceForm({ resource, onChange, onRemove, index }: ResourceFormProps) {
  const update = (partial: Partial<ServiceResource>) => onChange({ ...resource, ...partial });

  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Resource {index + 1}</span>
        <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={onRemove}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-[120px_1fr] gap-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Method</Label>
          <Select value={resource.method} onValueChange={(v) => update({ method: v as HttpMethod })}>
            <SelectTrigger className="h-9 bg-secondary text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">URL Pattern</Label>
          <Input
            placeholder="/orders/{id}"
            value={resource.urlPattern}
            onChange={(e) => update({ urlPattern: e.target.value })}
            className="h-9 bg-secondary text-sm font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Proxy Host</Label>
          <Input
            placeholder="https://api.example.com"
            value={resource.proxyHost}
            onChange={(e) => update({ proxyHost: e.target.value })}
            className="h-9 bg-secondary text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Skip Status Codes</Label>
          <Input
            placeholder="500, 429"
            value={resource.skipStatusCodes}
            onChange={(e) => update({ skipStatusCodes: e.target.value })}
            className="h-9 bg-secondary text-sm font-mono"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={resource.recordingEnabled} onCheckedChange={(v) => update({ recordingEnabled: v })} />
        <Label className="text-sm text-muted-foreground">Recording Enabled</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ReplacementList
          label="Request Replacements"
          pairs={resource.requestReplacements}
          onChange={(p) => update({ requestReplacements: p })}
        />
        <ReplacementList
          label="Response Replacements"
          pairs={resource.responseReplacements}
          onChange={(p) => update({ responseReplacements: p })}
        />
      </div>
    </div>
  );
}
