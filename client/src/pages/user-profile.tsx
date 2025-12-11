import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, getUserRegistrations, getOrganizerEvents, getEventRegistrations, Registration, createEvent, updateUser } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Settings, 
  Ticket, 
  Plus, 
  Users, 
  DollarSign, 
  BarChart3,
  CalendarDays
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function EventRegistrationsList({ eventId }: { eventId: number }) {
  const { data: registrations, isLoading } = useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: () => getEventRegistrations(eventId),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading attendees...</div>;

  if (!registrations || registrations.length === 0) {
    return <div className="text-sm text-muted-foreground">No registrations yet.</div>;
  }

  return (
    <div className="space-y-3 mt-4">
      <h4 className="font-semibold text-sm">Recent Registrations</h4>
      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
        {registrations.map((reg) => (
          <div key={reg.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{reg.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{reg.fullName}</p>
                <p className="text-xs text-muted-foreground">{reg.email}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">{reg.ticketType}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { user: authUser, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("registrations");
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (isLoading || !authUser) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  const userId = authUser.id;

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });

  const { data: myRegistrations, isLoading: isLoadingRegs } = useQuery({
    queryKey: ["user-registrations", userId],
    queryFn: () => getUserRegistrations(userId),
  });

  const { data: myEvents, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["organizer-events", userId],
    queryFn: () => getOrganizerEvents(userId),
  });

  const createEventMutation = useMutation({
    mutationFn: (eventData: {
      title: string;
      date: string;
      location: string;
      description: string;
      price: string;
      image: string;
      category: string;
      isPublic: boolean;
    }) => createEvent({
      ...eventData,
      organizerId: userId,
    }),
    onSuccess: () => {
      toast({
        title: "Event Created!",
        description: "Your event has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["organizer-events", userId] });
      setCreateEventDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
        <div className="flex items-center gap-6 flex-1">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-heading font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">{user.bio}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 w-full md:w-auto grid grid-cols-3 md:flex">
          <TabsTrigger value="registrations">Attending</TabsTrigger>
          <TabsTrigger value="organizing">Organizing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Tab: My Registrations (Attending) */}
        <TabsContent value="registrations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Events You're Attending</h2>
            <Button variant="link" asChild>
              <Link href="/">Browse more events</Link>
            </Button>
          </div>

          {isLoadingRegs ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : myRegistrations?.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Ticket className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No registrations yet</h3>
                <p className="text-muted-foreground mb-6">You haven't registered for any events yet.</p>
                <Button asChild>
                  <Link href="/">Discover Events</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myRegistrations?.map((reg) => (
                <Card key={reg.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-32 md:h-auto bg-muted relative">
                      {reg.event?.image && (
                        <img 
                          src={reg.event.image} 
                          alt={reg.event.title} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <Badge variant="outline" className="mb-2">{reg.ticketType}</Badge>
                          <h3 className="text-xl font-bold mb-2">{reg.event?.title}</h3>
                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {reg.event?.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {reg.event?.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                          <Button variant="outline" asChild className="flex-1 md:flex-none">
                            <Link href={`/registrations/${reg.id}`}>View Ticket</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Tab: My Organized Events */}
        <TabsContent value="organizing" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Events You Organize</h2>
            <Dialog open={createEventDialogOpen} onOpenChange={setCreateEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new event.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const eventData = {
                    title: formData.get('title') as string,
                    date: formData.get('date') as string,
                    location: formData.get('location') as string,
                    description: formData.get('description') as string,
                    price: formData.get('price') as string,
                    image: formData.get('image') as string || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
                    category: formData.get('category') as string,
                  };
                  const isPublicValue = formData.get('isPublic') === 'true';
                  createEventMutation.mutate({
                    ...eventData,
                    isPublic: isPublicValue,
                  });
                }} className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input id="title" name="title" placeholder="e.g., Annual Tech Meetup" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input id="date" name="date" type="date" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input id="location" name="location" placeholder="e.g., San Francisco or Remote" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input id="category" name="category" placeholder="e.g., Technology, Music, Sports" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input id="price" name="price" placeholder="e.g., Free or $299" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" name="description" placeholder="Describe your event..." required />
                    </div>
                    <div className="grid gap-2">
                      <Label>Event Visibility *</Label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="isPublic"
                            value="true"
                            defaultChecked
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">Public</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="isPublic"
                            value="false"
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">Private</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={createEventMutation.isPending} className="w-full">
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Organizer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{myEvents?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">452</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">$12,450</div>
              </CardContent>
            </Card>
          </div>

          {isLoadingEvents ? (
            <div className="text-center py-12 text-muted-foreground">Loading events...</div>
          ) : (
            <div className="grid gap-6">
              {myEvents?.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Event Image & Basic Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-20 w-32 bg-muted rounded-md overflow-hidden flex-shrink-0 hidden sm:block">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={event.price === "Free" ? "secondary" : "default"}>
                              {event.price}
                            </Badge>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Management Actions */}
                      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-center">
                         <div className="flex items-center justify-between mb-2">
                           <span className="font-semibold text-sm">Attendee List</span>
                           <Button variant="ghost" size="sm" className="h-8 text-xs">Export CSV</Button>
                         </div>
                         <EventRegistrationsList eventId={event.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your profile and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const updateData = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  bio: formData.get('bio') as string,
                  avatar: formData.get('avatar') as string,
                };

                updateUser(userId, updateData)
                  .then(() => {
                    toast({
                      title: "Profile Updated!",
                      description: "Your profile has been successfully updated.",
                    });
                    queryClient.invalidateQueries({ queryKey: ["user", userId] });
                  })
                  .catch((error: Error) => {
                    toast({
                      title: "Error",
                      description: error.message || "Failed to update profile",
                      variant: "destructive",
                    });
                  });
              }} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" defaultValue={user.name} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={user.email} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input id="avatar" name="avatar" defaultValue={user.avatar || ''} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" defaultValue={user.bio || ''} />
                </div>
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
