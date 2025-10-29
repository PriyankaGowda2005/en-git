import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2 } from "lucide-react";

export default function ReviewSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const shareUrl = useMemo(() => {
    try {
      return `${window.location.origin}/review/${sessionId}`;
    } catch {
      return `/review/${sessionId}`;
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      toast.error("Invalid session ID");
      navigate("/review");
      return;
    }
    // TODO: Socket/Backend join logic can be placed here
  }, [sessionId, navigate]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Session link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Review Session</CardTitle>
          <CardDescription>Share this link to collaborate in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="outline" className="font-mono">{sessionId}</Badge>
            <Button size="sm" variant="outline" onClick={copyLink}>
              <Copy className="h-4 w-4 mr-2" /> Copy Link
            </Button>
            <Button size="sm" variant="outline" onClick={copyLink}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>

          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            This is a placeholder session view. Socket and annotation UI can connect using the session ID above.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


