'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockBusinessEvents, mockTeams } from '@/lib/mock-data';
import { useUser } from '@/lib/user-context';
import type { WorkRequest } from '@/lib/types';

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (request: Omit<WorkRequest, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
}

interface FormData {
  clientName: string;
  clientId: string;
  businessEventId: string;
  subEventId: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  accountNumber?: string;
  amount?: string;
}

const INITIAL_FORM_DATA: FormData = {
  clientName: '',
  clientId: '',
  businessEventId: '',
  subEventId: '',
  title: '',
  description: '',
  priority: 'normal',
  accountNumber: '',
  amount: '',
};

export function CreateRequestDialog({ open, onOpenChange, onSubmit }: CreateRequestDialogProps) {
  const { currentUser } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const selectedEvent = mockBusinessEvents.find((e) => e.id === formData.businessEventId);
  const selectedSubEvent = selectedEvent?.subEvents.find((s) => s.id === formData.subEventId);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (stepNumber === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
      if (!formData.clientId.trim()) newErrors.clientId = 'Client ID is required';
    }

    if (stepNumber === 2) {
      if (!formData.businessEventId) newErrors.businessEventId = 'Business event is required';
      if (!formData.subEventId) newErrors.subEventId = 'Sub-event is required';
    }

    if (stepNumber === 3) {
      if (!formData.title.trim()) newErrors.title = 'Request title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(3)) return;

    // Determine routing based on business event
    const routedTeam = mockTeams.find((team) =>
      team.businessEvents.includes(formData.businessEventId)
    );

    // Calculate SLA deadline (example: 48 hours from now)
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 48);

    const newRequest: Omit<WorkRequest, 'id' | 'createdAt' | 'updatedAt' | 'timeline'> = {
      title: formData.title,
      description: formData.description,
      status: 'new',
      priority: formData.priority,
      businessEventId: formData.businessEventId,
      subEventId: formData.subEventId,
      clientName: formData.clientName,
      clientId: formData.clientId,
      advisorName: currentUser.name,
      advisorId: currentUser.id,
      assignedTo: routedTeam?.members[0] || 'unassigned',
      teamId: routedTeam?.id || 'unassigned',
      slaDeadline,
      slaStatus: 'on-track',
      accountNumber: formData.accountNumber,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
    };

    onSubmit(newRequest);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onOpenChange(false);
  };

  const getRoutingPreview = () => {
    if (!formData.businessEventId) return null;

    const routedTeam = mockTeams.find((team) =>
      team.businessEventIds?.includes(formData.businessEventId)
    );

    return routedTeam ? (
      <Alert className="bg-accent/10 border-accent">
        <Check className="h-4 w-4 text-accent" />
        <AlertDescription>
          This request will be automatically routed to <strong>{routedTeam.name}</strong>
        </AlertDescription>
      </Alert>
    ) : (
      <Alert className="bg-warning/10 border-warning">
        <AlertCircle className="h-4 w-4 text-warning" />
        <AlertDescription>
          No routing rule found. Request will be assigned to default queue.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create New Request</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  stepNumber < step
                    ? 'bg-primary text-primary-foreground'
                    : stepNumber === step
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stepNumber < step ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    stepNumber < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Client Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the client details for this request
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName">
                  Client Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  placeholder="John Smith"
                  className={errors.clientName ? 'border-destructive' : ''}
                />
                {errors.clientName && (
                  <p className="text-sm text-destructive">{errors.clientName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">
                  Client ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => updateField('clientId', e.target.value)}
                  placeholder="CL-123456"
                  className={errors.clientId ? 'border-destructive' : ''}
                />
                {errors.clientId && (
                  <p className="text-sm text-destructive">{errors.clientId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number (Optional)</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => updateField('accountNumber', e.target.value)}
                  placeholder="ACC-789012"
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Event Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Request Type</h3>
                <p className="text-sm text-muted-foreground">
                  Select the business event and category
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEvent">
                  Business Event <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.businessEventId}
                  onValueChange={(value) => {
                    updateField('businessEventId', value);
                    updateField('subEventId', ''); // Reset sub-event when event changes
                  }}
                >
                  <SelectTrigger
                    id="businessEvent"
                    className={errors.businessEventId ? 'border-destructive' : ''}
                  >
                    <SelectValue placeholder="Select business event" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBusinessEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.businessEventId && (
                  <p className="text-sm text-destructive">{errors.businessEventId}</p>
                )}
              </div>

              {formData.businessEventId && selectedEvent && (
                <div className="space-y-2">
                  <Label htmlFor="subEvent">
                    Sub-Event <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.subEventId}
                    onValueChange={(value) => updateField('subEventId', value)}
                  >
                    <SelectTrigger
                      id="subEvent"
                      className={errors.subEventId ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder="Select sub-event" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedEvent.subEvents.map((subEvent) => (
                        <SelectItem key={subEvent.id} value={subEvent.id}>
                          {subEvent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subEventId && (
                    <p className="text-sm text-destructive">{errors.subEventId}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Request Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Request Details</h3>
                <p className="text-sm text-muted-foreground">
                  Provide detailed information about the request
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Request Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Brief description of the request"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Provide detailed information about the request..."
                  rows={5}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => updateField('priority', value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedEvent?.name.includes('Account') && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Optional)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => updateField('amount', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Review Request</h3>
                <p className="text-sm text-muted-foreground">
                  Please review your request before submitting
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">
                    {formData.clientName} ({formData.clientId})
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Request Type</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{selectedEvent?.name}</Badge>
                    <Badge variant="outline">{selectedSubEvent?.name}</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{formData.title}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{formData.description}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge
                    variant={
                      formData.priority === 'urgent'
                        ? 'destructive'
                        : formData.priority === 'high'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {formData.priority.toUpperCase()}
                  </Badge>
                </div>

                {formData.amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">${parseFloat(formData.amount).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {getRoutingPreview()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {step < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Request</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
