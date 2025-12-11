import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getEvents } from "@/lib/mock-data";
import { Calendar as CalendarIcon, MapPin, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Events() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const filteredEvents = events?.filter(event => {
    if (!date) return true;
    const eventDate = new Date(event.date);
    return eventDate >= date;
  });

  return (
    <div className="pb-20 pt-12">
      <section id="events" className="container mx-auto px-4 mb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4 border-b pb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-foreground">Upcoming Events</h1>
            <p className="text-muted-foreground mt-2 text-lg">Curated experiences just for you</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground hidden md:inline">Filter by date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal h-10",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
            {date && (
              <Button variant="ghost" size="icon" onClick={() => setDate(undefined)} title="Clear filter">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredEvents?.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">Try selecting a different date or view all events.</p>
            <Button onClick={() => setDate(undefined)} variant="outline">View All Events</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents?.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-foreground hover:bg-white font-medium shadow-sm backdrop-blur-sm">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="font-heading text-xl leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2 mt-2 text-sm font-medium">
                      <span className="flex items-center text-primary">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4 border-t bg-muted/20">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-lg">{event.price}</span>
                      <Button asChild className="group-hover:translate-x-1 transition-transform" data-testid={`register-btn-${event.id}`}>
                        <Link href={`/register?eventId=${event.id}`}>
                          Register <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
