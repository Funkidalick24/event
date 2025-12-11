import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getEvents, createRegistration, Event } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Calendar, MapPin } from "lucide-react";

const formSchema = z.object({
  eventId: z.string({
    required_error: "Please select an event.",
  }),
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  ticketType: z.string({
    required_error: "Please select a ticket type.",
  }),
});

export default function Register() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Parse query params for eventId
  const searchParams = new URLSearchParams(window.location.search);
  const initialEventId = searchParams.get("eventId") || "";
  
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const mutation = useMutation({
    mutationFn: createRegistration,
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: "We've secured your spot.",
      });
      setLocation(`/registrations/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: initialEventId,
      fullName: "",
      email: "",
      ticketType: "standard",
    },
  });

  // Update form value when events load if needed
  useEffect(() => {
    if (initialEventId && events) {
      form.setValue("eventId", initialEventId);
    }
  }, [initialEventId, events, form]);

  const selectedEventId = form.watch("eventId");
  const selectedEvent = events?.find(e => e.id.toString() === selectedEventId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      eventId: parseInt(values.eventId),
      fullName: values.fullName,
      email: values.email,
      ticketType: values.ticketType,
    });
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Event Details (if selected) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          {selectedEvent ? (
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden border bg-card shadow-sm">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-heading text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                    <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">About the event</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col justify-center h-full p-8 bg-muted/20 rounded-2xl border border-dashed">
              <div className="text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Select an event to view details</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <Card className="border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-heading">Secure Your Spot</CardTitle>
              <CardDescription>
                Complete the form below to register for your next great experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="eventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-event">
                              <SelectValue placeholder="Select an event" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingEvents ? (
                              <div className="p-2 text-center text-sm">Loading events...</div>
                            ) : (
                              events?.map((event) => (
                                <SelectItem key={event.id} value={event.id.toString()}>
                                  {event.title}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="jane@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ticketType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ticket type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard Access</SelectItem>
                            <SelectItem value="vip">VIP Access (+$150)</SelectItem>
                            <SelectItem value="student">Student (ID Required)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          VIP includes backstage access and exclusive networking dinner.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold" 
                    disabled={mutation.isPending}
                    data-testid="button-submit"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
