import { Heart, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { COMMUNITY_POSTS } from "./data";

export function Community() {
  return (
    <div>
      <PageHeader title="Community" description="Class groups and clubs you're a part of" />
      <div className="space-y-3">
        {COMMUNITY_POSTS.map((post) => (
          <Card key={post.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{post.author}</p>
                  <p className="text-xs text-ink-300">{post.group}</p>
                </div>
                <span className="text-xs text-ink-300">{post.time}</span>
              </div>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-300">{post.content}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-ink-300">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" /> {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
