import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Copy, DoorOpen, Plus, QrCode } from "lucide-react";

export default function ReviewLanding() {
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState("");

  const createSession = async () => {
    try {
      const sessionId = (crypto?.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2, 10);
      navigate(`/review/${sessionId}`);
    } catch (e) {
      toast.error("Failed to create session");
    }
  };

  const joinSession = () => {
    const id = String(joinId || "").trim();
    if (!id) {
      toast.error("Enter a session ID");
      return;
    }
    navigate(`/review/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Collaborative Code Review</CardTitle>
          <CardDescription>Create a new session or join with an ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Create Session</h3>
              <p className="text-sm text-muted-foreground mb-4">Generate a new session ID and invite others to join.</p>
              <Button onClick={createSession} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Session
              </Button>
            </div>

            <div className="p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Join Session</h3>
              <p className="text-sm text-muted-foreground mb-4">Enter a session ID you received from a collaborator.</p>
              <div className="flex gap-2">
                <Input placeholder="e.g. 3b7a2f10-..." value={joinId} onChange={(e) => setJoinId(e.target.value)} />
                <Button onClick={joinSession} variant="outline">
                  <DoorOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-sm text-muted-foreground">
            Tip: After creating a session, copy the URL and share it with your teammates.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


