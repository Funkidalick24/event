import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import { AuthProvider } from "@/contexts/auth-context";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Events from "@/pages/events";
import Register from "@/pages/register";
import RegisterUser from "@/pages/register-user";
import Login from "@/pages/login";
import Confirmation from "@/pages/confirmation";
import UserProfile from "@/pages/user-profile";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/events" component={Events} />
        <Route path="/register" component={Register} />
        <Route path="/register-user" component={RegisterUser} />
        <Route path="/login" component={Login} />
        <Route path="/registrations/:id" component={Confirmation} />
        <Route path="/user-profile" component={UserProfile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
