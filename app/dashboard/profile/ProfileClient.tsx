"use client";

import { useActionState, useState, useTransition } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { roleOptions, skillSuggestions} from "@/lib/mock-data";
import { profile } from "./actions";

type User = {
  created_at: string;
  email: string;
  full_name: string;
  grade: string;
  id: string;
  school: string | null;
  skills: string[] | null;
  target: string[] | null;
  updated_at: string;
}

export function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState<string>(user.full_name);
  const [grade, setGrade] = useState<string>(user.grade);
  const [roles, setRoles] = useState<string[]>(user.target ?? []);
  const [skills, setSkills] = useState<string[]>(user.skills ?? []);
  const [state, formAction] = useActionState(profile, { ok: false });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.set('name', name);
    formData.set('grade', grade);
    formData.set('target', JSON.stringify(roles));
    formData.set('skills', JSON.stringify(skills));

    startTransition(() => formAction(formData));
  }

  return (
    <div className="space-y-6">
      {state.message && 
        (state.ok ? (
          <p className="rounded-xl border px-3.5 py-2.5 text-sm text-green-400">
            {state.message}
          </p>
        ) : (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
            {state.message}
          </p>
        ))
      }
      <Card>
        <CardHeader
          title="Personal details"
          description="Used to tailor your readiness analysis."
        />
        <CardBody className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name">
            <Input id="name" value={name} onChange={({target}) => setName(target.value)} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" defaultValue={user.email} />
          </Field>
          {/* <Field label="School" htmlFor="school">
            <Input id="school" defaultValue={user.school} />
          </Field> */}
          <Field label="Grade" htmlFor="grade">
            <Select id="grad" value={grade} onChange={({target}) => setGrade(target.value)}>
              {["Freshman", "Sophomore", "Junior", "Senior"].map((y) => (
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
        <Button onClick={() => handleSubmit()} disabled={isPending}>{isPending ? 'Saving...' : 'Save changes'}</Button>
      </div>
    </div>
  );
}
