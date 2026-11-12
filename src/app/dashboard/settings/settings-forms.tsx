"use client";

import { useActionState } from "react";
import { Alert, Card, CardBody, CardHeader } from "@/components/ui/card";
import { FieldError, FieldHint, Input, Label, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import {
  deleteAccountAction,
  updateEmailAction,
  updatePasswordAction,
  updateProfileAction,
  type SettingsState,
} from "./actions";

const initialState: SettingsState = {};

export function ProfileForm({
  displayName,
  username,
  bio,
  avatarUrl,
}: {
  displayName: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
}) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold">Profile details</h2>
        <p className="text-xs text-muted">This is what visitors see at the top of your page.</p>
      </CardHeader>
      <CardBody>
        <form action={formAction} className="space-y-4">
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          {state.success ? <Alert tone="success">{state.success}</Alert> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={displayName}
                maxLength={60}
                required
              />
              {state.fieldErrors?.displayName ? (
                <FieldError>{state.fieldErrors.displayName}</FieldError>
              ) : null}
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={username}
                autoComplete="off"
                spellCheck={false}
                required
              />
              {state.fieldErrors?.username ? (
                <FieldError>{state.fieldErrors.username}</FieldError>
              ) : (
                <FieldHint>Changing this changes your public URL.</FieldHint>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={bio ?? ""} rows={3} maxLength={280} />
            <FieldHint>280 characters max.</FieldHint>
          </div>

          <div>
            <Label htmlFor="avatarUrl">Profile picture URL</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              defaultValue={avatarUrl ?? ""}
              placeholder="https://…"
              inputMode="url"
            />
            <FieldHint>Paste a public image URL. Uploads arrive in a later release.</FieldHint>
          </div>

          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Saving…">
              Save profile
            </SubmitButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export function EmailForm({ email }: { email: string }) {
  const [state, formAction] = useActionState(updateEmailAction, initialState);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold">Email address</h2>
        <p className="text-xs text-muted">Used to log in and to reach you about your account.</p>
      </CardHeader>
      <CardBody>
        <form action={formAction} className="space-y-4">
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          {state.success ? <Alert tone="success">{state.success}</Alert> : null}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={email} required />
            {state.fieldErrors?.email ? (
              <FieldError>{state.fieldErrors.email}</FieldError>
            ) : null}
          </div>
          <div>
            <Label htmlFor="email-password">Current password</Label>
            <Input
              id="email-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            {state.fieldErrors?.password ? (
              <FieldError>{state.fieldErrors.password}</FieldError>
            ) : null}
            <FieldHint>Confirm this change with your password.</FieldHint>
          </div>
          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Updating…">
              Update email
            </SubmitButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialState);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold">Password</h2>
        <p className="text-xs text-muted">Choose something long and unique.</p>
      </CardHeader>
      <CardBody>
        <form action={formAction} className="space-y-4">
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          {state.success ? <Alert tone="success">{state.success}</Alert> : null}
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
            {state.fieldErrors?.currentPassword ? (
              <FieldError>{state.fieldErrors.currentPassword}</FieldError>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
              />
              {state.fieldErrors?.newPassword ? (
                <FieldError>{state.fieldErrors.newPassword}</FieldError>
              ) : null}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
              {state.fieldErrors?.confirmPassword ? (
                <FieldError>{state.fieldErrors.confirmPassword}</FieldError>
              ) : null}
            </div>
          </div>
          <div className="flex justify-end">
            <SubmitButton size="sm" pendingLabel="Updating…">
              Update password
            </SubmitButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export function DeleteAccountForm() {
  const [state, formAction] = useActionState(deleteAccountAction, initialState);

  return (
    <Card className="border-red-200">
      <CardHeader className="border-red-100 bg-red-50/60">
        <h2 className="text-sm font-semibold text-red-800">Delete account</h2>
        <p className="text-xs text-red-700/80">
          Permanently remove your account, profile, links, socials and analytics. This cannot be
          undone.
        </p>
      </CardHeader>
      <CardBody>
        <form
          action={formAction}
          onSubmit={(event) => {
            if (!window.confirm("Delete your account and all data permanently?")) {
              event.preventDefault();
            }
          }}
          className="space-y-4"
        >
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="delete-password">Password</Label>
              <Input
                id="delete-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
              {state.fieldErrors?.password ? (
                <FieldError>{state.fieldErrors.password}</FieldError>
              ) : null}
            </div>
            <div>
              <Label htmlFor="confirmation">Type DELETE to confirm</Label>
              <Input id="confirmation" name="confirmation" placeholder="DELETE" required />
              {state.fieldErrors?.confirmation ? (
                <FieldError>{state.fieldErrors.confirmation}</FieldError>
              ) : null}
            </div>
          </div>
          <div className="flex justify-end">
            <SubmitButton variant="danger" size="sm" pendingLabel="Deleting…">
              Delete my account
            </SubmitButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
