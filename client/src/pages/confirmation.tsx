import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getRegistration, getEvent } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Calendar, MapPin, User, Ticket, Download, Share2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Confirmation() {
  const [match, params] = useRoute("/registrations/:id");
  const id = params ? parseInt(params.id) : 0;

  const { data: registration, isLoading: isLoadingReg } = useQuery({
    queryKey: ["registration", id],
    queryFn: () => getRegistration(id),
    enabled: !!id,
  });

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", registration?.eventId],
    queryFn: () => getEvent(registration!.eventId),
    enabled: !!registration,
  });

  if (isLoadingReg || (registration && isLoadingEvent)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!registration || !event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Registration Not Found</h2>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-muted/30 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 ring-8 ring-green-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-heading font-bold mb-2">You're All Set!</h1>
          <p className="text-muted-foreground text-lg">
            Registration confirmed for <span className="font-semibold text-foreground">{event.title}</span>
          </p>
        </div>

        <Card className="overflow-hidden border-t-4 border-t-primary shadow-lg">
          <CardHeader className="bg-primary/5 pb-6 border-b border-dashed">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Registration ID</p>
                <p className="font-mono text-xl font-bold text-foreground">#{registration.id.toString().padStart(6, '0')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <User className="w-4 h-4" />
                  Attendee
                </div>
                <p className="font-semibold text-lg">{registration.fullName}</p>
                <p className="text-sm text-muted-foreground">{registration.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Ticket className="w-4 h-4" />
                  Ticket Type
                </div>
                <p className="font-semibold text-lg capitalize">{registration.ticketType}</p>
                <p className="text-sm text-muted-foreground">General Access</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Event Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Date & Time</p>
                    <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-muted-foreground text-sm">9:00 AM - 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-6 gap-4">
            <Button className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Ticket
            </Button>
            <Button className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
