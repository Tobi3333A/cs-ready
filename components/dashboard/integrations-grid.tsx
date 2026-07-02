"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { integrations as seed, type Integration } from "@/lib/mock-data";

export function IntegrationsGrid() {
  const [items, setItems] = useState<Integration[]>(seed);

  const toggle = (key: string) =>
    setItems((prev) =>
      prev.map((it) =>
        it.key === key
          ? { ...it, connected: !it.connected, meta: it.connected ? undefined : it.meta }
          : it
      )
    );

  const connectedCount = items.filter((i) => i.connected).length;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-brand-600/12 to-surface">
        <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm text-muted">Signal strength</p>
            <p className="text-xl font-semibold text-foreground">
              {connectedCount} of {items.length} sources connected
            </p>
          </div>
          <div className="flex -space-x-2">
            {items
              .filter((i) => i.connected)
              .map((i) => (
                <span
                  key={i.key}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-base"
                  title={i.name}
                >
                  {i.icon}
                </span>
              ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <Card key={it.key} hover className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-xl ring-1 ring-inset ring-white/10">
                  {it.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{it.name}</p>
                    {it.connected && (
                      <Badge tone="accent" dot>
                        Connected
                      </Badge>
                    )}
                  </div>
                  {it.connected && it.meta && (
                    <p className="text-xs text-subtle">{it.meta}</p>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">{it.description}</p>
            <Button
              variant={it.connected ? "outline" : "primary"}
              size="sm"
              className="mt-4 w-full"
              onClick={() => toggle(it.key)}
            >
              {it.connected ? "Disconnect" : "Connect"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
