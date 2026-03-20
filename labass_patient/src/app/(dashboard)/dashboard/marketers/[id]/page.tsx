"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useMarketers, useUpdateMarketer, useSendMessageToMarketer, useSendPromoCodesToMarketer } from "@/features/dashboard/hooks/use-marketers";
import { useGeneratePromoCode, useTogglePromoCode, useResetMarketerPromoUsage } from "@/features/dashboard/hooks/use-promo-codes";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { StatusBadge } from "@/features/dashboard/components/shared/status-badge";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import { FormSkeleton } from "@/features/dashboard/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, RefreshCw, Plus, Building2, User, Phone, Mail, Calendar, CreditCard, Globe } from "lucide-react";
import Link from "next/link";

export default function MarketerDetailPage() {
  const params = useParams();
  const marketerId = Number(params.id);
  const { data: marketers, isLoading, error, refetch } = useMarketers();
  const updateMarketer = useUpdateMarketer();
  const sendMessage = useSendMessageToMarketer();
  const sendPromoCodes = useSendPromoCodesToMarketer();
  const generatePromo = useGeneratePromoCode();
  const togglePromo = useTogglePromoCode();
  const resetUsage = useResetMarketerPromoUsage();

  const marketer = Array.isArray(marketers) ? marketers.find((m) => m.id === marketerId) : undefined;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    nationalId: "",
    dateOfBirth: "",
    iban: "",
    nationality: "",
  });
  const [messageDialog, setMessageDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [generateDialog, setGenerateDialog] = useState(false);
  const [promoConfig, setPromoConfig] = useState({ discountPercentage: 10, marketerPercentage: 10, numberOfCodes: 5 });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [promoErrors, setPromoErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (marketer) {
      setFormData({
        firstName: marketer.user?.firstName ?? marketer.firstName ?? "",
        lastName: marketer.user?.lastName ?? marketer.lastName ?? "",
        email: marketer.user?.email ?? marketer.email ?? "",
        gender: marketer.gender ?? "",
        nationalId: marketer.nationalId ?? "",
        dateOfBirth: marketer.dateOfBirth ? marketer.dateOfBirth.split("T")[0] : "",
        iban: marketer.iban ?? "",
        nationality: marketer.nationality ?? "",
      });
    }
  }, [marketer]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setEditErrors({});
  };

  if (isLoading) return <FormSkeleton fields={4} />;
  if (error) return <ErrorState onRetry={() => refetch()} />;
  if (!marketer) return <ErrorState title="Not found" message="Marketer not found" />;

  const handleUpdateMarketer = async () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (formData.iban && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(formData.iban)) errors.iban = "Invalid IBAN format";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
    if (Object.keys(errors).length > 0) { setEditErrors(errors); return; }
    setEditErrors({});
    await updateMarketer.mutateAsync({
      marketerId,
      marketerData: {
        iban: formData.iban,
        nationality: formData.nationality,
      },
      userData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        nationalId: formData.nationalId,
        dateOfBirth: formData.dateOfBirth,
      },
    });
  };

  const handleSendMessage = async () => {
    await sendMessage.mutateAsync({ marketerId, message });
    setMessageDialog(false);
    setMessage("");
  };

  const handleGeneratePromo = async () => {
    const errors: Record<string, string> = {};
    if (!promoConfig.discountPercentage || promoConfig.discountPercentage <= 0) errors.discountPercentage = "Must be a positive number";
    if (!promoConfig.numberOfCodes || promoConfig.numberOfCodes < 1) errors.numberOfCodes = "Must be at least 1";
    if (Object.keys(errors).length > 0) { setPromoErrors(errors); return; }
    setPromoErrors({});
    await generatePromo.mutateAsync({ marketerId, ...promoConfig });
    setGenerateDialog(false);
  };

  const displayFirstName = marketer.user?.firstName ?? marketer.firstName;
  const displayLastName = marketer.user?.lastName ?? marketer.lastName;
  const displayPhone = marketer.user?.phoneNumber ?? marketer.phoneNumber;
  const displayEmail = marketer.user?.email ?? marketer.email;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${displayFirstName} ${displayLastName}`}
        description={`Marketer ID: ${marketer.id}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setMessageDialog(true)}>
              <MessageSquare className="h-4 w-4 mr-1" /> Message
            </Button>
            <Button variant="outline" size="sm" onClick={() => sendPromoCodes.mutate(marketerId)}>
              <Send className="h-4 w-4 mr-1" /> Send Codes
            </Button>
          </div>
        }
      />

      {/* Marketer Details */}
      <Card>
        <CardHeader><CardTitle>Marketer Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{displayFirstName} {displayLastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium" dir="ltr">{displayPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium" dir="ltr">{displayEmail || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                {marketer.organization ? (
                  <Link
                    href={`/dashboard/organizations/${marketer.organization.id}`}
                    className="font-medium text-custom-green hover:underline"
                  >
                    {marketer.organization.name}
                  </Link>
                ) : (
                  <p className="font-medium">—</p>
                )}
              </div>
            </div>
            {marketer.gender && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{marketer.gender}</p>
                </div>
              </div>
            )}
            {marketer.dateOfBirth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{new Date(marketer.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            {marketer.nationalId && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">National ID</p>
                  <p className="font-medium" dir="ltr">{marketer.nationalId}</p>
                </div>
              </div>
            )}
            {marketer.nationality && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-medium">{marketer.nationality}</p>
                </div>
              </div>
            )}
            {marketer.iban && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-custom-green" />
                <div>
                  <p className="text-sm text-muted-foreground">IBAN</p>
                  <p className="font-medium font-mono text-sm" dir="ltr">{marketer.iban}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-custom-green" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(marketer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Marketer */}
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Edit Marketer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
              {editErrors.firstName && <p className="text-sm text-destructive">{editErrors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={formData.email} onChange={(e) => updateField("email", e.target.value)} dir="ltr" placeholder="email@example.com" />
              {editErrors.email && <p className="text-sm text-destructive">{editErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(val) => updateField("gender", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>National ID</Label>
              <Input value={formData.nationalId} onChange={(e) => updateField("nationalId", e.target.value)} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={formData.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} dir="ltr" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nationality</Label>
              <Input value={formData.nationality} onChange={(e) => updateField("nationality", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>IBAN</Label>
              <Input value={formData.iban} onChange={(e) => updateField("iban", e.target.value)} dir="ltr" placeholder="SA..." />
              {editErrors.iban && <p className="text-sm text-destructive">{editErrors.iban}</p>}
            </div>
          </div>

          <Button onClick={handleUpdateMarketer} disabled={updateMarketer.isPending}>
            {updateMarketer.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Promo Codes ({marketer.promoCodes?.length || 0})</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setGenerateDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> Generate
            </Button>
            <Button variant="outline" size="sm" onClick={() => resetUsage.mutate({ marketerId })}>
              <RefreshCw className="h-4 w-4 mr-1" /> Reset Usage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {marketer.promoCodes?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Marketer %</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Toggle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketer.promoCodes.map((pc) => (
                  <TableRow key={pc.id}>
                    <TableCell className="font-mono">{pc.code}</TableCell>
                    <TableCell>{pc.discountPercentage}%</TableCell>
                    <TableCell>{pc.marketerPercentage}%</TableCell>
                    <TableCell>{pc.usageCount}</TableCell>
                    <TableCell><StatusBadge status={pc.isActive ? "Active" : "Inactive"} /></TableCell>
                    <TableCell>
                      <Switch
                        checked={pc.isActive}
                        onCheckedChange={() => togglePromo.mutate({ codeId: pc.id })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No promo codes yet</p>
          )}
        </CardContent>
      </Card>

      {/* Send Message Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send Message to Marketer</DialogTitle></DialogHeader>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={sendMessage.isPending}>
              {sendMessage.isPending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Promo Code Dialog */}
      <Dialog open={generateDialog} onOpenChange={setGenerateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate Promo Codes</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Number of Codes</Label>
              <Input type="number" min={1} value={promoConfig.numberOfCodes} onChange={(e) => { setPromoConfig({ ...promoConfig, numberOfCodes: Number(e.target.value) }); setPromoErrors({}); }} />
              {promoErrors.numberOfCodes && <p className="text-sm text-destructive">{promoErrors.numberOfCodes}</p>}
            </div>
            <div className="space-y-2">
              <Label>Discount Percentage</Label>
              <Input type="number" min={1} max={100} value={promoConfig.discountPercentage} onChange={(e) => { setPromoConfig({ ...promoConfig, discountPercentage: Number(e.target.value) }); setPromoErrors({}); }} />
              {promoErrors.discountPercentage && <p className="text-sm text-destructive">{promoErrors.discountPercentage}</p>}
            </div>
            <div className="space-y-2">
              <Label>Marketer Percentage</Label>
              <Input type="number" min={0} max={100} value={promoConfig.marketerPercentage} onChange={(e) => { setPromoConfig({ ...promoConfig, marketerPercentage: Number(e.target.value) }); setPromoErrors({}); }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialog(false)}>Cancel</Button>
            <Button onClick={handleGeneratePromo} disabled={generatePromo.isPending}>
              {generatePromo.isPending ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
