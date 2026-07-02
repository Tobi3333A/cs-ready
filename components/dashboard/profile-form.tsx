"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { roleOptions, skillSuggestions, user } from "@/lib/mock-data";

export function ProfileForm() {
  const [roles, setRoles] = useState<string[]>([
    "Software Engineer Intern",
    "Full-Stack New Grad",
  ]);
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React",
    "Python",
    "SQL",
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Personal details"
          description="Used to tailor your readiness analysis."
        />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name">
            <Input id="name" defaultValue={user.name} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" defaultValue={user.email} />
          </Field>
          <Field label="School" htmlFor="school">
            <Input id="school" defaultValue={user.school} />
          </Field>
          <Field label="Graduation year" htmlFor="grad">
            <Select id="grad" defaultValue={user.gradYear}>
              {["2025", "2026", "2027", "2028", "2029"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Target roles"
          description="What you're aiming for — this drives your role-fit scores."
        />
        <CardBody>
          <TagInput value={roles} onChange={setRoles} suggestions={roleOptions} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Skills"
          description="Highlight your strongest technologies."
        />
        <CardBody>
          <TagInput value={skills} onChange={setSkills} suggestions={skillSuggestions} />
        </CardBody>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}
