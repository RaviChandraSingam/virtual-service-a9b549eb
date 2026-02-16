import { useState, useCallback } from "react";
import type { VirtualService, StubMapping, DroolsRule } from "@/types/virtualService";

// Simple global store using module-level state + React state sync
let services: VirtualService[] = [];
let stubs: StubMapping[] = [];
let rules: DroolsRule[] = [];
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((l) => l());
}

export function useServiceStore() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  // auto-subscribe
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    services,
    stubs,
    rules,
    addService: (s: VirtualService) => {
      services = [...services, s];
      notify();
    },
    updateService: (s: VirtualService) => {
      services = services.map((x) => (x.id === s.id ? s : x));
      notify();
    },
    deleteService: (id: string) => {
      services = services.filter((x) => x.id !== id);
      stubs = stubs.filter((x) => x.serviceId !== id);
      rules = rules.filter((x) => x.serviceId !== id);
      notify();
    },
    addStub: (s: StubMapping) => {
      stubs = [...stubs, s];
      notify();
    },
    updateStub: (s: StubMapping) => {
      stubs = stubs.map((x) => (x.id === s.id ? s : x));
      notify();
    },
    deleteStub: (id: string) => {
      stubs = stubs.filter((x) => x.id !== id);
      notify();
    },
    addRule: (r: DroolsRule) => {
      rules = [...rules, r];
      notify();
    },
    updateRule: (r: DroolsRule) => {
      rules = rules.map((x) => (x.id === r.id ? r : x));
      notify();
    },
    deleteRule: (id: string) => {
      rules = rules.filter((x) => x.id !== id);
      notify();
    },
    getServiceStubs: (serviceId: string) => stubs.filter((s) => s.serviceId === serviceId),
    getServiceRules: (serviceId: string) => rules.filter((r) => r.serviceId === serviceId),
  };
}
